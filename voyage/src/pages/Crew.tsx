import { users } from '../data/users'
import CrewCard from '../components/crew/CrewCard'
import { useMissions } from '../context/MissionContext'

export default function Crew(){
  const { missions } = useMissions()
  const pendingUpdates = missions.filter(m=> m.kind==='UPDATE').length
  const captains = users.filter(u=>u.role==='Co-Captain')
  const crew = users.filter(u=>u.role==='Crew Member')
  return (
    <div className="min-h-screen">
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-sky-700 grid place-items-center text-white text-[10px] font-bold">4</span>
          <span className="text-[11px] tracking-[0.14em] font-bold text-sky-200">CREW</span>
          <span className="text-[10px] text-white/40">Co-Captains + Crew · {pendingUpdates} updates</span>
        </div>
      </div>
      <div className="max-w-[1160px] mx-auto p-3">
        <div className="bg-[#f8fafc] rounded-[18px] border border-slate-200 shadow-[0_16px_48px_rgba(0,0,0,0.4)] p-4">
          <div className="text-[10px] tracking-[0.12em] font-bold text-slate-500 mb-3">CO-CAPTAINS — can create/edit missions</div>
          <div className="grid md:grid-cols-2 gap-3">
            {captains.map(u=> <CrewCard key={u.id} user={u} />)}
          </div>
          <div className="text-[10px] tracking-[0.12em] font-bold text-slate-500 mt-4 mb-3">CREW — view own missions, update own status</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {crew.map(u=> <CrewCard key={u.id} user={u} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
