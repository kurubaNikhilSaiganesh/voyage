import { useParams, Link } from 'react-router-dom'
import { getUserById } from '../data/users'
import { useMissions } from '../context/MissionContext'
import MissionCard from '../components/missions/MissionCard'
import { useAuth } from '../context/AuthContext'

export default function CrewMember(){
  const { id } = useParams()
  const user = id ? getUserById(id) : undefined
  const { getCurrentMissionForUser, getPreviousMissionsForUser } = useMissions()
  const { user: me } = useAuth()
  if(!user) return <div className="max-w-[800px] mx-auto px-4 py-10 text-white">Crew member not found.</div>
  const current = getCurrentMissionForUser(user.id)
  const prev = getPreviousMissionsForUser(user.id)

  return (
    <div className="max-w-[980px] mx-auto p-3">
      <Link to="/crew" className="text-sm text-white/60 hover:text-white">← Back to Crew</Link>
      <div className="mt-3 bg-[#f8fafc] rounded-[18px] border border-slate-200 p-5 flex items-center gap-4 shadow-[0_16px_48px_rgba(0,0,0,0.3)]">
        <div className="w-14 h-14 rounded-full grid place-items-center text-white font-bold text-lg border-2 border-white shadow" style={{background:user.color}}>{user.avatar}</div>
        <div>
          <div className="text-lg font-bold text-slate-900">{user.name} <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white border border-slate-200">{user.role}</span> {me?.id===user.id && <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-600 text-white">YOU</span>}</div>
          <div className="text-[11px] font-mono text-slate-500">ID: {user.id} · Joined {new Date(user.joinedAt).toLocaleDateString()}</div>
          <div className="text-xs text-slate-600 mt-1">Skills: {user.skills.join(', ')}</div>
        </div>
      </div>

      <div className="mt-4">
        {current ? <MissionCard mission={current} /> : <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No current mission.</div>}
      </div>

      <h3 className="mt-4 text-[10px] tracking-[0.12em] font-bold text-white/40">PREVIOUS MISSIONS</h3>
      <div className="mt-2 grid md:grid-cols-2 gap-3">
        {prev.length===0 ? <div className="text-sm text-white/50 bg-white/5 rounded-2xl border border-white/10 p-6">No previous missions.</div> : prev.map(m=> <MissionCard key={m.id} mission={m} />)}
      </div>
    </div>
  )
}
