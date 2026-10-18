import type { Mission, MissionStatus } from '../../types'
import { DeadlineBadge, deadlineInfo } from './DeadlineBadge'
import { getUserById } from '../../data/users'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useMissions } from '../../context/MissionContext'

export default function CurrentMission({ mission }: { mission: Mission }){
  const { user } = useAuth()
  const { updateMemberStatus } = useMissions()
  const assignee = mission.assignedTo==='ALL' ? null : getUserById(mission.assignedTo)
  const isCrewMission = mission.assignmentType==='CREW' && mission.kind==='MISSION'
  const myStatus: MissionStatus = isCrewMission ? (mission.memberStatuses?.[user?.id||''] || 'NOT_STARTED') : mission.status
  const deadline = deadlineInfo(mission.deadline, isCrewMission ? myStatus : mission.status)

  const canUpdate = user && (user.role==='Co-Captain' || mission.assignedTo===user.id || mission.assignedTo==='ALL')

  const setStatus = (s: MissionStatus) => {
    if (!user) return
    try { updateMemberStatus(mission.id, user.id, s) } catch(e:any){ alert(e.message)}
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="px-5 pt-5">
        <div className="flex items-center gap-2">
          <span className="text-[9px] tracking-[0.16em] font-bold text-slate-400">YOUR CURRENT MISSION</span>
          {mission.kind==='UPDATE' ? <span className="text-[9px] font-bold tracking-[0.12em] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">CREW UPDATE</span>
           : isCrewMission ? <span className="text-[9px] font-bold tracking-[0.12em] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">CREW MISSION</span>
           : <span className="text-[9px] font-bold tracking-[0.12em] px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200">INDIVIDUAL</span>}
        </div>
        <h2 className="mt-1 text-[16px] font-bold text-slate-900 leading-tight">{mission.title}</h2>
        <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">{mission.shortDescription}</p>
      </div>

      <div className="px-5 mt-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.12em] font-bold text-slate-500">VOYAGE FOCUS</span>
          <span className="text-[11px] font-bold text-slate-700">{myStatus==='COMPLETED'?'Done':'In Voyage'}</span>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full bg-[#1e6a8a] rounded-full transition-all" style={{width: myStatus==='COMPLETED'?'100%': myStatus==='IN_PROGRESS'?'68%':'22%'}} />
        </div>
        <Link to={`/missions/${mission.id}`} className="inline-block mt-1.5 text-[11px] font-medium text-sky-700 hover:underline">View Details →</Link>
      </div>

      <div className="h-px bg-slate-200 mt-4" />

      <div className="px-5 py-4 space-y-4">
        <div className="text-[12px] leading-relaxed text-slate-700 bg-slate-50 border border-slate-200 rounded-xl p-3">{mission.description}</div>

        {mission.kind==='MISSION' && (
          <div>
            <div className="text-[9px] tracking-[0.14em] font-bold text-slate-500">WHAT YOU NEED TO DO</div>
            <ul className="mt-2 space-y-1.5">
              {mission.objectives.map((o,i)=>(
                <li key={i} className="flex gap-2 text-[12px] text-slate-700">
                  <span className="mt-[7px] w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        )}

        {mission.kind==='MISSION' && mission.requirements.length>0 && (
          <div className="flex flex-wrap gap-1.5">
            {mission.requirements.map(r=> <span key={r} className="text-[10px] px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-600">{r}</span>)}
          </div>
        )}

        <div className="rounded-xl bg-[#0a1628] text-white p-3">
          <div className="text-[9px] tracking-[0.14em] font-bold text-white/60">{mission.kind==='UPDATE' ? 'FROM CAPTAINS' : 'EXPECTED OUTPUT'}</div>
          <div className="text-[12px] font-medium mt-1 leading-relaxed">{mission.expectedOutput}</div>
        </div>

        <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 flex items-center gap-3">
          {mission.assignedTo==='ALL' ? (
            <div className="w-9 h-9 rounded-full bg-sky-600 text-white grid place-items-center text-[10px] font-bold">ALL</div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#0a1628] text-white grid place-items-center text-xs font-bold border border-white shadow">{assignee?.avatar}</div>
          )}
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-slate-900">{mission.assignedTo==='ALL' ? 'Entire Crew' : `${assignee?.name} · ${assignee?.role}`}</div>
            <div className="text-[10px] font-mono text-slate-500">ID: {mission.assignedTo} {assignee?.id ? `· assigned` : ''}</div>
          </div>
        </div>

        <DeadlineBadge deadline={mission.deadline} status={isCrewMission ? myStatus : mission.status} completionDate={mission.completionDate} />

        <div className="flex gap-2">
          <span className={`text-[10px] font-bold tracking-[0.12em] px-2.5 py-1 rounded-full border ${myStatus==='IN_PROGRESS'?'bg-sky-50 text-sky-700 border-sky-200': myStatus==='COMPLETED'?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-slate-50 text-slate-600 border-slate-200'}`}>{myStatus.replace('_',' ')}</span>
          <span className="text-[10px] text-slate-400 self-center">{deadline.label}</span>
        </div>

        {canUpdate && mission.kind==='MISSION' && (
          <div className="flex gap-1.5 flex-wrap">
            {(['NOT_STARTED','IN_PROGRESS','COMPLETED'] as MissionStatus[]).map(s=>(
              <button key={s} onClick={()=>setStatus(s)} disabled={myStatus===s} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${myStatus===s?'bg-[#0a1628] text-white border-[#0a1628]':'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>{s.replace('_',' ')}</button>
            ))}
          </div>
        )}

        <Link to={`/missions/${mission.id}`} className="block text-center w-full py-2.5 rounded-xl bg-[#0a1628] text-white text-xs font-bold tracking-wide hover:bg-[#132a47]">View Mission Details →</Link>
      </div>
    </div>
  )
}
