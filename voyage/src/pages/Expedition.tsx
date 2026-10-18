import { Link } from 'react-router-dom'
import { useMissions } from '../context/MissionContext'
import { useAuth } from '../context/AuthContext'

export default function Expedition(){
  const { user } = useAuth()
  const { missions } = useMissions()
  const ordered = [...missions].filter(m=> m.kind==='MISSION' && !m.archived).sort((a,b)=> new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime())
  const uniq = ordered.slice(0,7)
  return (
    <div className="min-h-screen">
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#e8c99a] grid place-items-center text-[10px] font-bold">3</span>
          <span className="text-[11px] tracking-[0.14em] font-bold text-[#e8c99a]">EXPEDITION MAP</span>
          <span className="text-[10px] text-white/40">Voyage journey — your position is the ship</span>
        </div>
      </div>
      <div className="max-w-[1160px] mx-auto p-3">
        <div className="parchment rounded-[18px] overflow-hidden border border-[#d8c9a6] shadow-[0_16px_48px_rgba(0,0,0,0.4)] p-4 lg:p-6">
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="bg-white/70 backdrop-blur rounded-2xl border border-[#d8c9a6] p-3">
              <div className="text-[10px] tracking-[0.12em] font-bold text-[#8b6b2a]">OVERALL VOYAGE</div>
              <div className="flex items-baseline gap-2 mt-1"><span className="text-xl font-bold text-[#1a6a8a]">54%</span><span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700">Open Sea</span></div>
              <div className="mt-2 h-1.5 rounded-full bg-[#e8ddd0] overflow-hidden"><div className="h-full w-[54%] bg-[#1e6a8a]"/></div>
            </div>
            <div className="hidden lg:block" />
            <div className="bg-white/70 rounded-2xl border border-[#d8c9a6] p-3 flex items-center gap-3 justify-between">
              <div><div className="text-[10px] tracking-[0.12em] font-bold text-[#8b6b2a]">DESTINATION</div><div className="text-[12px] font-semibold text-slate-800">Project Complete</div></div><span className="text-2xl">🏝️</span>
            </div>
          </div>
          <div className="mt-4 relative bg-[#fdf6e3] rounded-xl border border-[#d8c9a6] p-4 lg:p-6 min-h-[420px] overflow-hidden">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 380" preserveAspectRatio="none">
              <path d="M70 280 C 160 250, 220 320, 320 220 S 520 80, 700 140" fill="none" stroke="#b9a07a" strokeWidth="1.6" strokeDasharray="6 8" opacity={0.9}/>
              <g transform="translate(340,205) rotate(-10)"><text x="0" y="0" fontSize="22">⛵</text></g>
            </svg>
            <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-3 pt-8">
              {uniq.map((m)=>{
                const isCrew = m.assignmentType==='CREW'
                const myStatus = isCrew && user ? (m.memberStatuses?.[user.id]||'NOT_STARTED') : m.status
                const isCurrent = user && (m.assignedTo===user.id || m.assignedTo==='ALL') && myStatus!=='COMPLETED' && m.status!=='COMPLETED'
                const isCompleted = isCrew ? (myStatus==='COMPLETED') : m.status==='COMPLETED'
                return (
                  <Link key={m.id} to={`/missions/${m.id}`} className={`relative bg-white rounded-2xl border p-3 shadow-sm hover:shadow-md transition ${isCurrent?'border-sky-300 ring-1 ring-sky-200': isCompleted?'border-emerald-200':'border-[#d8c9a6]'}`}>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isCompleted?'bg-emerald-500': isCurrent?'bg-sky-500':'bg-amber-400'}`}/>
                      <span className="text-[10px] font-bold tracking-[0.08em] text-slate-500 truncate">{m.title.split('—')[0]?.trim()}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-800 mt-1 line-clamp-1">{m.title.split('—').slice(1).join('—').trim() || m.shortDescription}</div>
                    <div className="text-[10px] text-slate-500 mt-1">{isCompleted ? '✓ Completed (your status)' : isCurrent ? '● Current · In Progress' : m.status}</div>
                  </Link>
                )
              })}
            </div>
            <div className="absolute left-[6%] top-[56%] text-xl opacity-80">🏔️</div><div className="absolute right-[8%] top-[28%] text-2xl opacity-80">🏝️</div>
          </div>
        </div>
      </div>
    </div>
  )
}
