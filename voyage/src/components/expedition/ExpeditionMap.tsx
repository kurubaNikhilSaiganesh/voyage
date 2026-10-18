import { Link } from 'react-router-dom'
import { missions } from '../../data/missions'
import { useAuth } from '../../context/AuthContext'

export default function ExpeditionMap(){
  const { user } = useAuth()
  // unique missions ordered by createdAt for map
  const ordered = [...missions].sort((a,b)=> new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  // deduplicate by id keep first
  const seen = new Set<string>()
  const uniq = ordered.filter(m=> { if(seen.has(m.id)) return false; seen.add(m.id); return true})
  // pick 7 representative
  const display = uniq.slice(0,8)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold tracking-widest text-xs text-slate-500">EXPEDITION MAP</h3>
        <span className="text-xs text-slate-500">START → DESTINATION</span>
      </div>
      <div className="mt-6 relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
        {/* ship indicator on current user's mission */}
        <div className="space-y-5">
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-emerald-700"><span className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 grid place-items-center">⚑</span> START</div>
          {display.map(m=>{
            const isCurrent = user?.currentMissionId===m.id
            const isCompleted = m.status==='COMPLETED'
            return (
              <Link key={m.id} to={`/missions/${m.id}`} className={`relative flex gap-3 p-3 rounded-xl border transition ${isCurrent ? 'bg-sky-50 border-sky-300 shadow' : isCompleted ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200 hover:bg-white'}`}>
                <div className={`w-8 h-8 rounded-full grid place-items-center shrink-0 border-2 ${isCompleted?'bg-emerald-500 border-emerald-600 text-white': isCurrent?'bg-sky-600 border-sky-700 text-white animate-pulse':'bg-white border-slate-300 text-slate-600'}`}>
                  {isCompleted ? '✓' : isCurrent ? '●' : '○'}
                </div>
                <div className="min-w-0">
                  <div className={`text-sm font-semibold ${isCurrent?'text-sky-900':''}`}>{m.title} {isCurrent && <span className="ml-2 text-[10px] tracking-widest bg-sky-600 text-white px-2 py-0.5 rounded-full">CURRENT</span>}</div>
                  <div className="text-xs text-slate-600 truncate">{m.shortDescription}</div>
                  <div className="text-[11px] text-slate-500">Due {new Date(m.deadline).toLocaleDateString()} · {m.status.replace('_',' ')}</div>
                </div>
                {isCurrent && <div className="absolute -right-2 -top-2 text-lg">🚢</div>}
              </Link>
            )
          })}
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest text-[#0f2f44]"><span className="w-8 h-8 rounded-full bg-[#0f2f44] text-white grid place-items-center">🏝</span> DESTINATION</div>
        </div>
      </div>
    </div>
  )
}
