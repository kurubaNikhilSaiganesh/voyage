import { activities } from '../data/activities'

function groupByDate(){
  const g: Record<string, typeof activities> = {}
  for(const a of activities){ if(!g[a.date]) g[a.date]=[]; g[a.date].push(a) }
  return g
}

export default function CaptainLog(){
  const grouped = groupByDate()
  const today='2026-08-30'
  return (
    <div className="min-h-screen">
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#c9a86a] grid place-items-center text-[10px] font-bold text-[#0a1628]">2</span>
          <span className="text-[12px] tracking-[0.14em] font-bold text-[#c9a86a]">CAPTAIN'S LOG</span>
          <span className="text-[10px] text-white/40">Navigation · Logbook · Timeless</span>
        </div>
      </div>

      <div className="max-w-[1160px] mx-auto p-2 lg:p-3">
        <div className="bg-[#0a1628] rounded-[18px] border border-white/10 overflow-hidden relative shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
          {/* top decoration like Concept 2: compass + ship + coordinates */}
          <div className="relative h-[112px] overflow-hidden border-b border-white/10 bg-gradient-to-b from-[#0f2340] to-[#0a1628] flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#c9a86a] grid place-items-center">🧭</span>
              <span className="text-[10px] tracking-wide text-white/50">23° 15' N, 72° 45' E</span>
            </div>
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" className="opacity-30">
              <circle cx="48" cy="48" r="40" stroke="#c9a86a" strokeWidth="0.6"/>
              <circle cx="48" cy="48" r="28" stroke="#c9a86a" strokeWidth="0.4"/>
              <path d="M48 8 L48 88 M8 48 L88 48 M22 22 L74 74 M74 22 L22 74" stroke="#c9a86a" strokeWidth="0.4"/>
            </svg>
            <div className="text-white/40 text-xl">⛵</div>
          </div>

          <div className="grid lg:grid-cols-[1.4fr_0.9fr] gap-4 p-4">
            {/* CURRENT ENTRY — Concept 2 central card */}
            <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-4 backdrop-blur">
              <div className="text-[9px] tracking-[0.14em] font-bold text-white/40">CURRENT ENTRY</div>
              <div className="text-[14px] font-bold text-white mt-1">Build Authentication System</div>
              <div className="text-[11px] text-white/60 mt-1">Status: <span className="text-[#c9a86a] font-semibold">In Progress</span></div>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden"><div className="h-full w-[80%] bg-[#c9a86a]"/></div>
                <span className="text-[11px] font-bold text-[#c9a86a]">80%</span>
              </div>

              <div className="mt-6 rounded-xl bg-white/[0.04] border border-white/10 p-3">
                <div className="text-[9px] tracking-[0.14em] font-bold text-white/40">CREW ACTIVITY LOG</div>
                <div className="mt-3 space-y-2.5">
                  <div className="flex gap-2 text-[11px]"><span className="w-5 h-5 rounded-full bg-white/10 grid place-items-center text-[9px]">①</span><span className="text-white/50">09:30</span><span className="text-white">Zaid completed Login UI</span></div>
                  <div className="flex gap-2 text-[11px]"><span className="w-5 h-5 rounded-full bg-white/10 grid place-items-center text-[9px]">②</span><span className="text-white/50">11:15</span><span className="text-white">Harika working on Form Validation</span></div>
                  <div className="flex gap-2 text-[11px]"><span className="w-5 h-5 rounded-full bg-white/10 grid place-items-center text-[9px]">③</span><span className="text-white/50">01:20</span><span className="text-white">Sameer (Crew) uploaded analysis</span></div>
                  <div className="flex gap-2 text-[11px]"><span className="w-5 h-5 rounded-full bg-white/10 grid place-items-center text-[9px]">④</span><span className="text-white/50">03:45</span><span className="text-white">Madhu working on API integration</span></div>
                </div>
              </div>
            </div>

            {/* right column: LOG DETAILS parchment + voyage progress */}
            <div className="space-y-4">
              <div className="parchment rounded-2xl border border-[#d8c9a6] p-4 relative">
                <div className="absolute -top-1 left-4 w-2 h-2 rounded-full bg-[#c9a86a]/60" />
                <div className="absolute -top-1 right-4 w-2 h-2 rounded-full bg-[#c9a86a]/60" />
                <div className="text-[9px] tracking-[0.14em] font-bold text-[#8b6b2a]">LOG DETAILS</div>
                <div className="mt-2 space-y-1.5 text-[11px]">
                  <div className="flex justify-between"><span className="text-[#8b6b2a]/70">Priority</span><span className="font-semibold text-slate-800">High</span></div>
                  <div className="flex justify-between"><span className="text-[#8b6b2a]/70">Category</span><span className="text-slate-700">Development</span></div>
                  <div className="flex justify-between"><span className="text-[#8b6b2a]/70">Due Date</span><span className="text-slate-700">25 May 2024</span></div>
                  <div className="flex justify-between"><span className="text-[#8b6b2a]/70">Assigned To</span><span className="text-slate-700">Team</span></div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-4">
                <div className="text-[9px] tracking-[0.14em] font-bold text-white/40">VOYAGE PROGRESS</div>
                <div className="text-[12px] font-semibold text-white mt-1">Open Sea</div>
                <div className="text-[11px] text-white/50">You have crossed 60% of the journey</div>
                <div className="mt-3 h-[88px] relative overflow-hidden rounded-xl bg-[#0f2340] border border-white/10 p-2">
                  <svg viewBox="0 0 200 60" className="w-full h-full">
                    <path d="M10 40 C60 30, 100 50, 150 20 S180 10, 190 18" fill="none" stroke="#c9a86a" strokeWidth="1" strokeDasharray="3 4"/>
                    <text x="152" y="18" fontSize="10">⛵</text>
                    <circle cx="190" cy="18" r="3" fill="none" stroke="#c9a86a" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* grouped historical entries */}
          <div className="px-4 pb-4 space-y-3">
            {Object.entries(grouped).sort((a,b)=> b[0].localeCompare(a[0])).map(([date, items])=>(
              <div key={date} className="rounded-2xl bg-white/[0.04] border border-white/10 p-4">
                <div className="text-[10px] tracking-[0.12em] font-bold text-white/30">{date===today ? 'TODAY' : new Date(date).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}</div>
                <div className="mt-2 space-y-2">
                  {items.map(it=>(
                    <div key={it.id} className="flex gap-3 text-[11px] border-l-2 border-[#c9a86a]/40 pl-3 py-1">
                      <span className="text-white/40 font-mono w-[44px] shrink-0">{it.time}</span>
                      <span className="text-white/90"><span className="font-semibold">{it.userName}</span> <span className="text-white/40 text-[10px]">{it.userRole}</span> <span className="text-white/60"> {it.action} “{it.missionTitle}”</span></span>
                      {it.deadline && <span className="ml-auto text-[#c9a86a] text-[10px]">Deadline: {new Date(it.deadline).toLocaleDateString()}</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
