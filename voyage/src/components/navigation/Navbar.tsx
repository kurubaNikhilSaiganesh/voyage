import { NavLink, useNavigate } from 'react-router-dom'
import { Anchor, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

export default function Navbar(){
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  if(!user) return null
  const isCaptain = user.role === 'Co-Captain'
  const links = [
    { to: '/', label: 'My Voyage' },
    { to: '/missions', label: 'Missions' },
    { to: '/expedition', label: 'Expedition' },
    { to: '/log', label: "Captain's Log" },
    { to: '/crew', label: 'Crew' },
    { to: '/achievements', label: 'Achievements' },
    { to: '/profile', label: 'Profile' },
    ...(isCaptain ? [{ to: '/control', label: 'Mission Control' } as any] : []),
  ]

  return (
    <>
      {/* TOP VOYAGE HEADER — reference's outer title bar, now functional nav */}
      <header className="sticky top-0 z-40 bg-[#070f1e]/85 backdrop-blur border-b border-white/10">
        <div className="hidden lg:block text-center py-1.5 border-b border-white/5 bg-[#0a1628]">
          <span className="text-[10px] tracking-[0.18em] font-bold text-sky-200">THE VOYAGE — ONE TEAM · ONE MISSION</span>
          <span className="text-[10px] text-white/30 ml-3">Co-Captains: Koushik & Sameer (Co-Captain) | Crew: Sameer (Crew), Zaid, Madhu, Nikhil, Harika</span>
        </div>
        <div className="max-w-[1420px] mx-auto px-3 h-[48px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-white grid place-items-center text-[#0a1628]"><Anchor size={13}/></div>
            <span className="text-xs font-bold tracking-[0.16em] text-white hidden sm:inline">THE VOYAGE</span>
            <span className="hidden xl:inline-flex ml-2 text-[10px] tracking-wide text-white/40 border-l border-white/10 pl-3">{user.name} · {user.role} · {user.id}</span>
          </div>

          {/* Center pill nav — like Minimal Voyage header, not sidebar */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur">
            {links.map(l=>(
              <NavLink key={l.to} to={l.to}
                className={({isActive})=>`px-3 py-1.5 rounded-full text-xs font-semibold transition ${isActive ? 'bg-white text-[#0a1628] shadow' : 'text-white/60 hover:text-white hover:bg-white/10'} ${l.label==='Mission Control'?'!text-amber-300':''}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-2 pl-2">
              <div className="w-7 h-7 rounded-full grid place-items-center text-white text-[11px] font-bold border border-white/20" style={{background:user.color}}>{user.avatar}</div>
              <button onClick={()=>{logout(); nav('/login')}} className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#0a1628] text-xs font-bold hover:bg-slate-100"><LogOut size={12}/>Logout</button>
            </div>
            <button onClick={()=>setOpen(v=>!v)} className="lg:hidden w-8 h-8 rounded-full bg-white/10 grid place-items-center text-white border border-white/10">{open ? <X size={14}/> : <Menu size={14}/>}</button>
          </div>
        </div>
        {open && (
          <div className="lg:hidden border-t border-white/10 bg-[#0a1628] p-3 grid grid-cols-2 gap-2">
            {links.map(l=>(
              <NavLink key={l.to} to={l.to} onClick={()=>setOpen(false)} className={({isActive})=>`text-center py-2.5 rounded-xl text-xs font-semibold ${isActive?'bg-white text-[#0a1628]':'bg-white/5 text-white/70 border border-white/10'}`}>{l.label}</NavLink>
            ))}
            <button onClick={()=>{logout(); nav('/login')}} className="col-span-2 py-2.5 rounded-xl bg-white text-[#0a1628] text-xs font-bold">Logout — {user.name} · {user.role}</button>
          </div>
        )}
      </header>

      {/* Mobile bottom nav — keeps access */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#070f1e] border-t border-white/10 flex overflow-x-auto">
        {links.slice(0,6).map(l=>(
          <NavLink key={l.to} to={l.to} className={({isActive})=>`flex-1 min-w-[56px] grid place-items-center py-2.5 gap-0.5 ${isActive?'text-white':'text-white/40'}`}>
            <span className="text-[9px] font-bold tracking-[0.08em]">{l.label.toUpperCase().slice(0,7)}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
