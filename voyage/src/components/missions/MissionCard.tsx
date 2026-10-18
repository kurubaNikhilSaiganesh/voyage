import { Link } from 'react-router-dom'
import type { Mission } from '../../types'
import { DeadlineBadge } from './DeadlineBadge'
import { getUserById } from '../../data/users'
import { useAuth } from '../../context/AuthContext'

export default function MissionCard({ mission }: { mission: Mission }) {
  const { user } = useAuth()
  const assignee = mission.assignedTo==='ALL' ? null : getUserById(mission.assignedTo)
  const isCrew = mission.assignmentType==='CREW' && mission.kind==='MISSION'
  const myStatus = isCrew && user ? (mission.memberStatuses?.[user.id] || 'NOT_STARTED') : mission.status
  const statusDot = myStatus==='COMPLETED' ? 'bg-emerald-500' : myStatus==='IN_PROGRESS' ? 'bg-sky-500' : 'bg-slate-400'
  const badge = mission.kind==='UPDATE' ? 'UPDATE' : mission.assignmentType
  return (
    <Link to={`/missions/${mission.id}`} className="block bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${statusDot}`}></span>
            <span className="text-[9px] font-bold tracking-[0.12em] px-1.5 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200">{badge}</span>
            <h3 className="font-semibold text-[13px] leading-tight text-slate-900 truncate">{mission.title}</h3>
          </div>
          <p className="text-[12px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{mission.shortDescription}</p>
        </div>
        <span className={`shrink-0 text-[9px] font-bold tracking-[0.12em] px-2 py-1 rounded-full border ${myStatus==='IN_PROGRESS'?'bg-sky-50 text-sky-700 border-sky-200': myStatus==='COMPLETED'?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-slate-50 text-slate-600 border-slate-200'}`}>{myStatus.replace('_',' ')}</span>
      </div>

      <div className="mt-3">
        <DeadlineBadge deadline={mission.deadline} status={myStatus} completionDate={mission.completionDate} variant="compact"/>
      </div>

      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
        {mission.assignedTo==='ALL' ? (
          <span className="w-6 h-6 rounded-full bg-sky-600 text-white grid place-items-center text-[10px] font-bold">A</span>
        ) : (
          <span className="w-6 h-6 rounded-full bg-[#0a1628] text-white grid place-items-center text-[10px] font-bold">{assignee?.avatar}</span>
        )}
        <span className="truncate">{mission.assignedTo==='ALL' ? 'Entire Crew' : `${assignee?.name} · ${assignee?.role}`} <span className="font-mono text-[10px]">· {mission.assignedTo}</span></span>
      </div>

      {mission.status==='COMPLETED' && mission.result && mission.assignmentType==='INDIVIDUAL' && (
        <div className="mt-3 text-[12px] leading-relaxed text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">✓ {mission.result}</div>
      )}
    </Link>
  )
}
