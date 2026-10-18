import MissionCard from '../components/missions/MissionCard'
import { useAuth } from '../context/AuthContext'
import { useMissions } from '../context/MissionContext'
import { useState } from 'react'
import CreateMissionModal from '../components/missions/CreateMissionModal'

export default function Missions(){
  const { user } = useAuth()
  const { missions } = useMissions()
  const [filter, setFilter] = useState<'all'|'mine'|'individual'|'crew'|'completed'|'inprogress'|'updates'>('all')
  const [openCreate, setOpenCreate] = useState(false)
  const isCaptain = user?.role==='Co-Captain'
  let list = [...missions]
  if(filter==='mine' && user) list = missions.filter(m=> m.assignedTo===user.id || m.assignedTo==='ALL')
  if(filter==='individual') list = missions.filter(m=>m.assignmentType==='INDIVIDUAL' && m.kind==='MISSION')
  if(filter==='crew') list = missions.filter(m=>m.assignmentType==='CREW' && m.kind==='MISSION')
  if(filter==='updates') list = missions.filter(m=>m.kind==='UPDATE')
  if(filter==='completed') list = missions.filter(m=> m.status==='COMPLETED' || (m.memberStatuses && user && m.memberStatuses[user.id]==='COMPLETED'))
  if(filter==='inprogress') list = missions.filter(m=> m.kind==='MISSION' && m.status==='IN_PROGRESS')

  return (
    <div className="max-w-[1160px] mx-auto p-3">
      <div className="bg-[#f8fafc] rounded-[18px] border border-slate-200 p-4 lg:p-6 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Missions</h1>
            <p className="text-xs text-slate-500">All missions — individual, crew, and updates. Crew missions track per-member status separately.</p>
          </div>
          {isCaptain && <button onClick={()=>setOpenCreate(true)} className="px-4 py-2 rounded-full bg-[#0a1628] text-white text-xs font-bold">+ Create Mission</button>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(['all','mine','individual','crew','updates','inprogress','completed'] as const).map(k=>(
            <button key={k} onClick={()=>setFilter(k)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${filter===k?'bg-[#0a1628] text-white border-[#0a1628]':'bg-white text-slate-700 border-slate-200'}`}>{k==='mine' ? 'My Missions' : k.toUpperCase()}</button>
          ))}
        </div>
        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map(m=> <MissionCard key={m.id} mission={m} />)}
          {list.length===0 && <div className="col-span-full text-center text-sm text-slate-500 py-10">No missions in this filter.</div>}
        </div>
      </div>
      <CreateMissionModal open={openCreate} onClose={()=>setOpenCreate(false)} />
    </div>
  )
}
