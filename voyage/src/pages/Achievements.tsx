import { achievements } from '../data/achievements'
import { useAuth } from '../context/AuthContext'

export default function Achievements(){
  const { user } = useAuth()
  return (
    <div className="max-w-[980px] mx-auto p-3">
      <div className="bg-[#f8fafc] rounded-[18px] border border-slate-200 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
        <h1 className="text-lg font-bold text-slate-900">Achievements</h1>
        <p className="text-xs text-slate-500">Secondary recognition — subtle, like the reference's small footer icons.</p>
        <div className="mt-6 grid md:grid-cols-2 gap-3">
          {achievements.map(a=>{
            const unlocked = user ? a.unlockedFor.includes(user.id) : false
            return (
              <div key={a.id} className={`rounded-2xl border p-4 flex gap-3 ${unlocked?'bg-white border-slate-200':'bg-slate-50 border-slate-200 opacity-60'}`}>
                <div className="text-2xl">{a.icon}</div>
                <div>
                  <div className="text-[13px] font-semibold text-slate-900">{a.title} {unlocked && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Unlocked</span>}</div>
                  <div className="text-xs text-slate-600">{a.description}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{a.criteria}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
