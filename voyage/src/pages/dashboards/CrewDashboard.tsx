import { useAuth } from '../../context/AuthContext'
import { useMissions } from '../../context/MissionContext'
import CurrentMission from '../../components/missions/CurrentMission'
import MissionCard from '../../components/missions/MissionCard'
import OceanScene from '../../components/ocean/OceanScene'
import { deadlineInfo } from '../../components/missions/DeadlineBadge'
import { activities } from '../../data/activities'

function SummaryBar({ label, count, max }: { label:string, count:number, max:number }){
  const w = max ? Math.max(6, (count / max) * 100) : 0
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-[88px] text-[11px] text-slate-500">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full bg-[#1e6a8a]" style={{width:`${w}%`}}/></div>
      <span className="w-6 text-right font-bold text-slate-700">{count}</span>
    </div>
  )
}

export default function CrewDashboard(){
  const { user } = useAuth()
  const { getMissionsForUser, getCurrentMissionForUser, getPreviousMissionsForUser } = useMissions()
  if(!user) return null
  const allForUser = getMissionsForUser(user.id).filter(m=> m.kind!=='UPDATE')
  const current = getCurrentMissionForUser(user.id)
  const previous = getPreviousMissionsForUser(user.id)
  const total = allForUser.length
  // compute per-status for this crew member (respecting crew per-member status)
  const countStatus = (status: string) => allForUser.filter(m=> {
    const s = m.assignmentType==='CREW' ? (m.memberStatuses?.[user.id] || 'NOT_STARTED') : m.status
    return s===status
  }).length
  const completed = countStatus('COMPLETED')
  const inProgress = countStatus('IN_PROGRESS')
  const notStarted = countStatus('NOT_STARTED')
  // overdue: not completed and deadline passed
  const overdue = allForUser.filter(m=>{
    const s = m.assignmentType==='CREW' ? (m.memberStatuses?.[user.id] || 'NOT_STARTED') : m.status
    if (s==='COMPLETED') return false
    const d = deadlineInfo(m.deadline, s)
    return d.state==='OVERDUE'
  }).length

  // deadline performance for completed: onTime vs late
  const completedMissions = allForUser.filter(m=>{
    const s = m.assignmentType==='CREW' ? (m.memberStatuses?.[user.id] || 'NOT_STARTED') : m.status
    return s==='COMPLETED'
  })
  let onTime = 0, late = 0
  for(const m of completedMissions){
    if(!m.completionDate) { onTime++ ; continue }
    const dead = new Date(m.deadline+'T23:59:59').getTime()
    const comp = new Date(m.completionDate+'T23:59:59').getTime()
    if(comp <= dead) onTime++; else late++
  }

  const maxBar = Math.max(1, Math.max(completed, inProgress, overdue, notStarted))
  const ownActivities = activities.filter(a=> a.userId===user.id).slice(0,4)

  return (
    <div className="max-w-[980px] mx-auto p-3 space-y-4">
      {/* Ocean top — soft personal horizon, not command banner */}
      <div className="rounded-[18px] overflow-hidden border border-slate-200 shadow-[0_16px_48px_rgba(0,0,0,0.25)]">
        <div className="relative h-[180px] overflow-hidden">
          <OceanScene compact={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 bg-white/92 backdrop-blur rounded-2xl border border-white px-4 py-3 shadow">
            <div className="text-[11px] tracking-[0.16em] font-bold text-[#0a1628]">YOUR VOYAGE</div>
            <div className="text-lg font-bold text-slate-900 leading-none mt-1">{user.name} <span className="text-xs font-normal text-slate-500">· {user.role}</span></div>
            <div className="text-[11px] text-slate-500 font-mono">ID: {user.id}</div>
          </div>
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur border border-white text-[10px] text-slate-600">Personal · Quiet · Focused</div>
        </div>

        <div className="bg-[#fcfcfb] p-4 lg:p-6 space-y-6">
          {/* Current mission — main visual focus, large */}
          <div>
            <div className="text-[11px] tracking-[0.14em] font-bold text-slate-500 mb-2">CURRENT MISSION — your focus</div>
            {current ? <CurrentMission mission={current}/> : <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No current mission. Your voyage is calm — await your next assignment.</div>}
          </div>

          {/* Your Mission Summary — actual data */}
          <div className="grid md:grid-cols-5 gap-3">
            {[
              {k:'Total Missions', v: total},
              {k:'Completed', v: completed},
              {k:'In Progress', v: inProgress},
              {k:'Overdue', v: overdue},
              {k:'Not Started', v: notStarted},
            ].map(s=>(
              <div key={s.k} className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
                <div className="text-2xl font-bold text-slate-900">{s.v}</div>
                <div className="text-[11px] tracking-[0.08em] font-bold text-slate-500">{s.k.toUpperCase()}</div>
              </div>
            ))}
          </div>

          {/* Two analysis panels side by side */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-[11px] tracking-[0.14em] font-bold text-slate-500">MISSION STATUS ANALYSIS</div>
              <div className="text-[11px] text-slate-400">Counts from your actual missions — not personality.</div>
              <div className="mt-4 space-y-2.5">
                <SummaryBar label="Completed" count={completed} max={maxBar}/>
                <SummaryBar label="In Progress" count={inProgress} max={maxBar}/>
                <SummaryBar label="Overdue" count={overdue} max={maxBar}/>
                <SummaryBar label="Not Started" count={notStarted} max={maxBar}/>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-[11px] tracking-[0.14em] font-bold text-slate-500">DEADLINE PERFORMANCE</div>
              <div className="text-[11px] text-slate-400">On time vs late — from completion dates vs deadlines.</div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3"><div className="text-lg font-bold text-emerald-700">{onTime}</div><div className="text-[10px] font-bold tracking-[0.08em] text-emerald-700">ON TIME</div></div>
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3"><div className="text-lg font-bold text-amber-700">{late}</div><div className="text-[10px] font-bold tracking-[0.08em] text-amber-700">LATE</div></div>
                <div className="rounded-xl bg-red-50 border border-red-200 p-3"><div className="text-lg font-bold text-red-700">{overdue}</div><div className="text-[10px] font-bold tracking-[0.08em] text-red-700">OVERDUE</div></div>
              </div>
            </div>
          </div>

          {/* Previous missions */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] tracking-[0.14em] font-bold text-slate-500">PREVIOUS MISSIONS — what you have done</span>
              <span className="text-xs text-slate-400">{previous.length} completed</span>
            </div>
            {previous.length===0 ? <div className="mt-3 rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">No history yet — your completed missions will appear here.</div>
            : <div className="mt-3 grid md:grid-cols-2 gap-3">{previous.slice(0,6).map(m=> <MissionCard key={m.id} mission={m}/>)}</div>}
          </div>

          {/* Personal status + activity */}
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-[11px] tracking-[0.14em] font-bold text-slate-500">PERSONAL STATUS</div>
              <div className="mt-3 space-y-2">
                {allForUser.slice(0,5).map(m=>{
                  const s = m.assignmentType==='CREW' ? (m.memberStatuses?.[user.id] || 'NOT_STARTED') : m.status
                  const col = s==='COMPLETED'?'bg-emerald-500': s==='IN_PROGRESS'?'bg-sky-500':'bg-slate-300'
                  return <div key={m.id} className="flex items-center gap-2 text-xs"><span className={`w-2 h-2 rounded-full ${col}`}/><span className="truncate flex-1 text-slate-700">{m.title}</span><span className="text-[10px] font-bold tracking-[0.08em] text-slate-500">{s.replace('_',' ')}</span></div>
                })}
                {allForUser.length===0 && <div className="text-xs text-slate-500">No missions assigned.</div>}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-[11px] tracking-[0.14em] font-bold text-slate-500">RECENT ACTIVITY — you</div>
              <div className="mt-3 space-y-2">
                {ownActivities.length===0 ? <div className="text-xs text-slate-500">No recent activity.</div> : ownActivities.map(a=>(
                  <div key={a.id} className="flex gap-2 text-xs"><span className="text-[11px] text-slate-400 font-mono">{a.time}</span><span className="text-slate-700">{a.action} “{a.missionTitle}”</span></div>
                ))}
                {/* include status changes as activity fallback */}
                {ownActivities.length===0 && allForUser.slice(0,2).map(m=> <div key={m.id} className="text-xs text-slate-600">Assigned “{m.title}” — due {new Date(m.deadline).toLocaleDateString()}</div>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
