import { useAuth } from '../context/AuthContext'
import { users } from '../data/users'
import { useNavigate } from 'react-router-dom'
import { Anchor } from 'lucide-react'
import OceanScene from '../components/ocean/OceanScene'

export default function Login(){
  const { login } = useAuth()
  const nav = useNavigate()
  const handle = (id:string) => { login(id); nav('/') }

  return (
    <div className="min-h-screen bg-[#070f1e] grid lg:grid-cols-[520px_1fr]">
      <div className="flex flex-col justify-center px-8 py-10 max-w-[520px] mx-auto w-full bg-[#0a1628] lg:min-h-screen">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white grid place-items-center text-[#0a1628]"><Anchor size={18}/></div>
          <span className="font-black tracking-[0.18em] text-white text-sm">THE VOYAGE</span>
        </div>
        <h1 className="mt-8 text-[28px] font-bold text-white leading-tight">Board The Voyage</h1>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">Select your crew identity. Two Sameer accounts are intentionally separate — same name, different voyage.</p>

        <div className="mt-8 grid gap-2.5">
          {users.map(u=>(
            <button key={u.id} onClick={()=>handle(u.id)} className="text-left flex items-center gap-3 p-3 rounded-2xl border border-white/10 bg-white/[0.06] hover:bg-white hover:border-white transition group">
              <div className="w-10 h-10 rounded-full grid place-items-center text-white font-bold shrink-0 text-sm border border-white/20" style={{background:u.color}}>{u.avatar}</div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold text-white group-hover:text-slate-900">{u.name} <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/20 ml-2 text-white/80 group-hover:text-slate-600 group-hover:border-slate-200">{u.role}</span></div>
                <div className="text-[11px] font-mono text-white/50 group-hover:text-slate-500">ID: {u.id}</div>
              </div>
              <span className="text-xs font-bold text-white/80 group-hover:text-sky-700">Log in →</span>
            </button>
          ))}
        </div>
        <p className="mt-6 text-[11px] text-white/30">Mock auth · localStorage persist · Phase 1 — no backend</p>
      </div>
      <div className="hidden lg:flex bg-[#070f1e] p-6 flex-col justify-center">
        <div className="rounded-[18px] overflow-hidden border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
          <OceanScene />
        </div>
        <div className="mt-6 text-white">
          <h2 className="text-lg font-semibold leading-snug">“Know your mission. Know your deadline. Know your history.”</h2>
          <p className="text-white/50 mt-2 text-xs leading-relaxed">Voyage Command Center · Captain’s Log · Expedition Map · Minimal Voyage — one Voyage, integrated like the reference. Ocean is the world, mission is the focus.</p>
          <div className="mt-4 inline-flex gap-2 text-[10px]">
            <span className="px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white/60">Secure Login</span>
            <span className="px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white/60">Deadlines First</span>
            <span className="px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white/60">History Preserved</span>
          </div>
        </div>
      </div>
    </div>
  )
}
