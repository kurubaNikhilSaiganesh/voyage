import { useParams, Link } from 'react-router-dom'
import { useMissions } from '../context/MissionContext'
import { getUserById } from '../data/users'
import { users } from '../data/users'
import { DeadlineBadge } from '../components/missions/DeadlineBadge'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import type { MissionStatus } from '../types'

export default function MissionDetails(){
  const { id } = useParams()
  const { getMissionById, updateMission, updateMemberStatus } = useMissions()
  const { user } = useAuth()
  const mission = id ? getMissionById(id) : undefined
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(mission?.title ?? '')
  const [deadline, setDeadline] = useState(mission?.deadline ?? '')

  if(!mission) return <div className="max-w-[800px] mx-auto px-4 py-10 text-white">Mission not found. <Link to="/missions" className="text-sky-300 underline">Back</Link></div>
  const assignee = mission.assignedTo==='ALL' ? null : getUserById(mission.assignedTo)
  const isCaptain = user?.role==='Co-Captain'
  const isCrewMission = mission.assignmentType==='CREW' && mission.kind==='MISSION'
  const myStatus = isCrewMission && user ? (mission.memberStatuses?.[user.id] || 'NOT_STARTED') : mission.status

  const setMyStatus = (s: MissionStatus) => {
    if(!user) return
    try { updateMemberStatus(mission.id, user.id, s)} catch(e:any){ alert(e.message)}
  }

  return (
    <div className="max-w-[980px] mx-auto p-3">
      <Link to="/missions" className="text-sm text-white/60 hover:text-white">← Back to Missions</Link>
      <div className="mt-3 bg-[#f8fafc] rounded-[18px] border border-slate-200 overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
        <div className="h-1 bg-gradient-to-r from-[#0a1628] via-[#1e6a8a] to-[#c9a86a]" />
        <div className="p-6">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-bold tracking-[0.12em] px-2 py-0.5 rounded-full border ${mission.kind==='UPDATE'?'bg-amber-50 text-amber-700 border-amber-200': isCrewMission?'bg-sky-50 text-sky-700 border-sky-200':'bg-slate-50 text-slate-600 border-slate-200'}`}>
              {mission.kind==='UPDATE' ? 'CREW UPDATE' : mission.assignmentType}
            </span>
            <span className="text-[9px] font-bold tracking-[0.12em] px-2 py-0.5 rounded-full bg-white border border-slate-200">{myStatus.replace('_',' ')}</span>
          </div>
          {!editing ? (
            <>
              <h1 className="text-xl font-bold text-slate-900 mt-2">{mission.title}</h1>
              <p className="text-[13px] text-slate-500 mt-1">{mission.shortDescription}</p>
              <p className="text-[13px] text-slate-700 mt-3 leading-relaxed bg-white border border-slate-200 rounded-xl p-3">{mission.description}</p>
            </>
          ) : (
            <div className="space-y-2 mt-3">
              <input value={title} onChange={e=>setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <div className="flex gap-2"><button onClick={()=>{updateMission(mission.id,{title,deadline}); setEditing(false)}} className="px-3 py-1.5 rounded-full bg-[#0a1628] text-white text-xs font-bold">Save</button><button onClick={()=>setEditing(false)} className="px-3 py-1.5 rounded-full border border-slate-200 text-xs">Cancel</button></div>
            </div>
          )}
          {isCaptain && !editing && <button onClick={()=>setEditing(true)} className="mt-2 text-xs font-bold text-sky-700">Edit mission (Co-Captain only)</button>}

          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-[10px] tracking-[0.12em] font-bold text-slate-500">ASSIGNED</div>
              <div className="flex items-center gap-2">
                {mission.assignedTo==='ALL' ? <div className="w-9 h-9 rounded-full bg-sky-600 text-white grid place-items-center text-xs font-bold">ALL</div> : <div className="w-9 h-9 rounded-full grid place-items-center text-white font-bold text-xs" style={{background:assignee?.color}}>{assignee?.avatar}</div>}
                <div><div className="text-[13px] font-semibold text-slate-900">{mission.assignedTo==='ALL' ? 'Entire Crew' : `${assignee?.name} · ${assignee?.role}`}</div><div className="text-[11px] font-mono text-slate-500">ID: {mission.assignedTo}</div></div>
              </div>
            </div>
            <div className="space-y-3">
              <DeadlineBadge deadline={mission.deadline} status={myStatus} completionDate={mission.completionDate}/>
              <div className="flex gap-1.5 flex-wrap">
                {(["NOT_STARTED","IN_PROGRESS","COMPLETED"] as MissionStatus[]).map(s=>(
                  <button key={s} onClick={()=>setMyStatus(s)} disabled={myStatus===s} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${myStatus===s?'bg-[#0a1628] text-white border-[#0a1628]':'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>{s.replace('_',' ')}</button>
                ))}
              </div>
              <div className="text-[11px] text-slate-500">Crew members update own status; Co-Captains can update any.</div>
            </div>
          </div>

          {isCrewMission && (
            <div className="mt-6 rounded-xl bg-white border border-slate-200 p-4">
              <div className="text-[10px] tracking-[0.12em] font-bold text-slate-500">CREW PROGRESS — per-member (independent)</div>
              <div className="mt-2 grid grid-cols-2 lg:grid-cols-4 gap-2">
                {users.filter(u=> u.role==='Crew Member' || u.role==='Co-Captain').map(u=>{
                  const s = mission.memberStatuses?.[u.id] || 'NOT_STARTED'
                  const col = s==='COMPLETED'?'bg-emerald-50 text-emerald-700 border-emerald-200': s==='IN_PROGRESS'?'bg-sky-50 text-sky-700 border-sky-200':'bg-slate-50 text-slate-500 border-slate-200'
                  return <span key={u.id} className={`text-[11px] px-2.5 py-1.5 rounded-full border font-medium ${col}`}>{u.name} ({u.id}): {s.replace('_',' ')}</span>
                })}
              </div>
            </div>
          )}

          {mission.kind==='MISSION' && (
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-[10px] tracking-[0.12em] font-bold text-slate-500">OBJECTIVES</h4>
                <ul className="mt-2 space-y-1.5 list-disc list-inside text-[12px] text-slate-800">{mission.objectives.map(o=> <li key={o}>{o}</li>)}</ul>
              </div>
              <div>
                <h4 className="text-[10px] tracking-[0.12em] font-bold text-slate-500">REQUIREMENTS</h4>
                <ul className="mt-2 flex flex-wrap gap-1.5">{mission.requirements.map(r=> <span key={r} className="text-[11px] px-2 py-1 rounded-full bg-white border border-slate-200">{r}</span>)}</ul>
                <h4 className="mt-4 text-[10px] tracking-[0.12em] font-bold text-slate-500">EXPECTED OUTPUT</h4>
                <p className="mt-1 text-[12px] text-slate-800 bg-white border border-slate-200 rounded-xl p-3">{mission.expectedOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
