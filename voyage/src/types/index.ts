export type Role = 'Co-Captain' | 'Crew Member'
export type MissionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
export type AssignmentType = 'INDIVIDUAL' | 'CREW'
export type MissionKind = 'MISSION' | 'UPDATE'

export interface User {
  id: string
  name: string
  displayName: string
  role: Role
  currentMissionId: string | null
  avatar: string
  color: string
  skills: string[]
  joinedAt: string
}

export interface Mission {
  id: string
  title: string
  shortDescription: string
  description: string
  why?: string
  objectives: string[]
  requirements: string[]
  expectedOutput: string
  status: MissionStatus
  assignedTo: string // individual id or 'ALL' for crew missions
  assignmentType?: AssignmentType
  kind?: MissionKind
  createdAt: string
  updatedAt: string
  deadline: string
  result?: string
  completionDate?: string
  skills: string[]
  memberStatuses?: Record<string, MissionStatus> // for crew missions, per-crew status
  archived?: boolean
  createdBy?: string
}

export interface Activity {
  id: string
  date: string
  time: string
  userId: string
  userName: string
  userRole: Role
  missionId: string
  missionTitle: string
  action: string
  detail?: string
  deadline?: string
  timestamp: string
}

export interface Achievement {
  id: string
  title: string
  icon: string
  description: string
  criteria: string
  unlockedFor: string[]
}
