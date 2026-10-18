import { Link } from 'react-router-dom'
import type { User } from '../../types'
import { useMissions } from '../../context/MissionContext'

export default function CrewCard({ user }: { user: User }){
  const { getCurrentMissionForUser } = useMissions()
  const current = getCurrentMissionForUser(user.id)
  const isCrewMission = current?.assignmentType==='CREW'
  const status = isCrewMission ? (current?.memberStatuses?.[user.id] || 'NOT_STARTED') : current?.status
  return (
    <Link to={`/crew/${user.id}`} className="block bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full grid place-items-center text-white font-bold" style={{background:user.color}}>{user.avatar}</div>
        <div className="min-w-0">
          <div className="font-semibold text-[13px] text-slate-900 truncate">{user.name} <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 ml-1">{user.role}</span></div>
          <div className="text-[11px] font-mono text-slate-500 truncate">ID: {user.id}</div>
        </div>
      </div>
      {current ? (
        <div className="mt-3">
          <div className="text-[9px] tracking-[0.12em] font-bold text-slate-500">CURRENT · {current.kind==='UPDATE'?'UPDATE':current.assignmentType}</div>
          <div className="text-[12px] font-medium text-slate-900 mt-1 line-clamp-1">{current.title}</div>
          <div className="text-[11px] text-slate-500 mt-1">📅 {new Date(current.deadline).toLocaleDateString()} · <span className={`font-bold ${status==='COMPLETED'?'text-emerald-600': status==='IN_PROGRESS'?'text-sky-600':'text-slate-500'}`}>{status?.replace('_',' ')}</span></div>
        </div>
      ) : (
        <div className="mt-3 text-xs text-slate-500">No current mission</div>
      )}
    </Link>
  )
}
