import { useAuth } from '../context/AuthContext'
import { useMissions } from '../context/MissionContext'
import { achievements } from '../data/achievements'
import MissionCard from '../components/missions/MissionCard'

export default function Profile(){
  const { user } = useAuth()
  const { getCurrentMissionForUser, getPreviousMissionsForUser } = useMissions()
  if(!user) return null
  const current = getCurrentMissionForUser(user.id)
  const prev = getPreviousMissionsForUser(user.id)
  const myAch = achievements.filter(a=>a.unlockedFor.includes(user.id))
  return (
    <div className="max-w-[980px] mx-auto p-3 space-y-4">
      <div className="bg-[#f8fafc] rounded-[18px] border border-slate-200 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.4)] flex gap-4 items-center">
        <div className="w-16 h-16 rounded-full grid place-items-center text-white font-bold text-xl border-2 border-white shadow" style={{background:user.color}}>{user.avatar}</div>
        <div>
          <div className="text-lg font-bold text-slate-900">{user.name} <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white border border-slate-200">{user.role}</span> <span className="text-[10px] font-mono text-slate-500">{user.id}</span></div>
          <div className="text-xs text-slate-600 mt-1">Skills: {user.skills.join(', ')}</div>
          {user.role==='Co-Captain' && <div className="text-[11px] text-amber-700 mt-1">Co-Captain privileges: create/edit missions at Mission Control.</div>}
        </div>
      </div>

      {current && (
        <div className="bg-[#f8fafc] rounded-[18px] border border-slate-200 p-4">
          <h3 className="text-[10px] tracking-[0.12em] font-bold text-slate-500">CURRENT MISSION</h3>
          <div className="mt-2"><MissionCard mission={current} /></div>
        </div>
      )}

      <div className="bg-[#f8fafc] rounded-[18px] border border-slate-200 p-4">
        <h3 className="text-[10px] tracking-[0.12em] font-bold text-slate-500">PREVIOUS MISSIONS</h3>
        <div className="mt-2 grid md:grid-cols-2 gap-3">
          {prev.length===0? <div className="text-sm text-slate-500">No history.</div> : prev.map(m=> <MissionCard key={m.id} mission={m} />)}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <h3 className="text-[10px] tracking-[0.12em] font-bold text-slate-500">ACHIEVEMENTS</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {myAch.map(a=> <span key={a.id} className="px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs">{a.icon} {a.title}</span>)}
          {myAch.length===0 && <span className="text-sm text-slate-500">No achievements yet.</span>}
        </div>
      </div>
    </div>
  )
}
