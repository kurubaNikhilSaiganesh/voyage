import { createContext, useContext, useEffect, useState } from 'react'
import type { Mission, MissionStatus } from '../types'
import { missions as seedMissions } from '../data/missions'
import { useAuth } from './AuthContext'

const STORAGE_KEY = 'voyage_missions_v3'

function hydrateSeed(): Mission[] {
  return seedMissions.map(m => ({
    ...m,
    assignmentType: (m as any).assignmentType || 'INDIVIDUAL',
    kind: (m as any).kind || 'MISSION',
    memberStatuses: (m as any).memberStatuses || undefined,
  })) as Mission[]
}

function loadMissions(): Mission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Mission[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return hydrateSeed()
}

function saveMissions(missions: Mission[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(missions))
}

type MissionContextType = {
  missions: Mission[]
  createMission: (data: Omit<Mission,'id'|'createdAt'|'updatedAt'|'status'|'memberStatuses'> & { status?: MissionStatus, memberStatuses?: Record<string,MissionStatus> }) => Mission
  updateMission: (id: string, patch: Partial<Mission>) => void
  archiveMission: (id: string) => void
  deleteMission: (id: string) => void
  updateMemberStatus: (missionId: string, memberId: string, status: MissionStatus) => void
  getMissionById: (id: string) => Mission | undefined
  getMissionsForUser: (userId: string) => Mission[]
  getCurrentMissionForUser: (userId: string) => Mission | null
  getPreviousMissionsForUser: (userId: string) => Mission[]
}

const MissionContext = createContext<MissionContextType | null>(null)

export function MissionProvider({ children }: { children: React.ReactNode }) {
  const [missions, setMissions] = useState<Mission[]>(() => loadMissions())
  const { user } = useAuth()

  useEffect(() => { saveMissions(missions) }, [missions])

  // also allow external reset via storage event? not needed

  const isCoCaptain = () => user?.role === 'Co-Captain'

  const createMission: MissionContextType['createMission'] = (data) => {
    if (!isCoCaptain()) throw new Error('Only Co-Captains can create missions')
    const now = new Date().toISOString()
    const id = 'm_' + Math.random().toString(36).slice(2,9)
    const isCrew = data.assignmentType === 'CREW' && data.kind === 'MISSION'
    const baseStatus: MissionStatus = data.status || 'NOT_STARTED'
    const mission: Mission = {
      id,
      title: data.title,
      shortDescription: data.shortDescription,
      description: data.description,
      why: data.why,
      objectives: data.objectives || [],
      requirements: data.requirements || [],
      expectedOutput: data.expectedOutput || '',
      status: baseStatus,
      assignedTo: data.assignedTo,
      assignmentType: data.assignmentType,
      kind: data.kind,
      createdAt: now,
      updatedAt: now,
      deadline: data.deadline,
      skills: data.skills || [],
      archived: false,
      createdBy: user?.id,
      memberStatuses: isCrew ? {} : undefined,
      result: data.result,
      completionDate: data.completionDate,
    }
    // for crew missions, initialize per-member statuses to NOT_STARTED if not provided
    if (isCrew && !mission.memberStatuses) mission.memberStatuses = {}
    setMissions(prev => [mission, ...prev])

    // log activity (also handled via separate Activities store ideally)
    return mission
  }

  const updateMission: MissionContextType['updateMission'] = (id, patch) => {
    if (!isCoCaptain()) throw new Error('Only Co-Captains can edit missions')
    setMissions(prev => prev.map(m => m.id === id ? { ...m, ...patch, updatedAt: new Date().toISOString() } : m))
  }

  const archiveMission = (id: string) => {
    if (!isCoCaptain()) throw new Error('Only Co-Captains can archive')
    setMissions(prev => prev.map(m => m.id === id ? { ...m, archived: true, updatedAt: new Date().toISOString() } : m))
  }

  const deleteMission = (id: string) => {
    if (!isCoCaptain()) throw new Error('Only Co-Captains can delete')
    setMissions(prev => prev.filter(m => m.id !== id))
  }

  const updateMemberStatus = (missionId: string, memberId: string, status: MissionStatus) => {
    // crew members can only update own status; co-captains can update any
    if (user?.role !== 'Co-Captain' && user?.id !== memberId) throw new Error('Cannot modify another member\'s mission status')
    setMissions(prev => prev.map(m => {
      if (m.id !== missionId) return m
      const isCrewMission = m.assignmentType === 'CREW'
      if (isCrewMission) {
        const next = { ...m.memberStatuses, [memberId]: status }
        // also bump updatedAt
        return { ...m, memberStatuses: next, updatedAt: new Date().toISOString() }
      } else {
        // individual mission: only the assignee or co-captain can update status
        if (m.assignedTo !== memberId && user?.role !== 'Co-Captain') throw new Error('Not authorized')
        const result = status === 'COMPLETED' ? (m.result || 'Completed') : m.result
        const completionDate = status === 'COMPLETED' ? new Date().toISOString().slice(0,10) : undefined
        return { ...m, status, result, completionDate, updatedAt: new Date().toISOString() }
      }
    }))
  }

  const getMissionById = (id: string) => missions.find(m => m.id === id && !m.archived)

  const getMissionsForUser = (userId: string) => missions.filter(m => !m.archived && (m.assignedTo === userId || m.assignedTo === 'ALL'))

  const getCurrentMissionForUser = (userId: string) => {
    const list = getMissionsForUser(userId)
    // For crew missions, check if user's per-member status is not COMPLETED
    const active = list.filter(m => {
      if (m.kind === 'UPDATE') return false
      if (m.assignmentType === 'CREW') {
        const s = m.memberStatuses?.[userId] || 'NOT_STARTED'
        return s !== 'COMPLETED'
      }
      return m.status !== 'COMPLETED'
    })
    // sort by deadline closest first, then newest
    active.sort((a,b)=> new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    if (active.length) return active[0]
    // fallback to most recent overall (including completed) for display
    const all = [...list].sort((a,b)=> new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    return all[0] || null
  }

  const getPreviousMissionsForUser = (userId: string) => {
    const list = getMissionsForUser(userId)
    return list.filter(m => {
      if (m.kind === 'UPDATE') return false
      if (m.assignmentType === 'CREW') return m.memberStatuses?.[userId] === 'COMPLETED'
      return m.status === 'COMPLETED'
    })
  }

  return (
    <MissionContext.Provider value={{ missions: missions.filter(m=>!m.archived), createMission, updateMission, archiveMission, deleteMission, updateMemberStatus, getMissionById, getMissionsForUser, getCurrentMissionForUser, getPreviousMissionsForUser }}>
      {children}
    </MissionContext.Provider>
  )
}

export const useMissions = () => {
  const ctx = useContext(MissionContext)
  if (!ctx) throw new Error('useMissions must be within MissionProvider')
  return ctx
}
