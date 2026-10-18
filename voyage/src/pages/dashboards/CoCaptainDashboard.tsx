import { useAuth } from '../../context/AuthContext'
import { useMissions } from '../../context/MissionContext'
import { users } from '../../data/users'
import OceanScene from '../../components/ocean/OceanScene'
import { deadlineInfo } from '../../components/missions/DeadlineBadge'
import { Link } from 'react-router-dom'
import { activities } from '../../data/activities'

function Stat({label, value}:{label:string,value:number}){
  return <div className="text-center"><div className="text-xl font-bold text-white">{value}</div><div className="text-[10px] tracking-[0.08em] font-bold text-white/50">{label.toUpperCase()}</div></div>
}

export default function CoCaptainDashboard(){
  const { user } = useAuth()
  const { missions } = useMissions()
  if(!user) return null
  const activeMissions = missions.filter(m=> m.kind==='MISSION' && !m.archived && m.status!=='COMPLETED')
  const individualMissions = activeMissions.filter(m=> m.assignmentType==='INDIVIDUAL')
  const crewMissions = activeMissions.filter(m=> m.assignmentType==='CREW')
  const crewMembers = users.filter(u=> u.role==='Crew Member')
  // also include Sameer crew as crew member but keep captains separate
  const allCrewForStats = crewMembers

  // team status aggregates
  const teamCompleted = missions.filter(m=> m.kind==='MISSION' && m.status==='COMPLETED').length + missions.filter(m=> m.assignmentType==='CREW').reduce((acc,m)=> acc + Object.values(m.memberStatuses||{}).filter(s=>s==='COMPLETED').length,0)
  const teamInProgress = missions.filter(m=> m.kind==='MISSION' && m.status==='IN_PROGRESS').length
  const teamNotStarted = missions.filter(m=> m.kind==='MISSION' && m.status==='NOT_STARTED').length
  const teamOverdue = missions.filter(m=>{
    if(m.kind!=='MISSION' || m.status==='COMPLETED') return false
    const d = deadlineInfo(m.deadline, m.status)
    return d.state==='OVERDUE'
  }).length

  // deadline watch
  const dueToday: typeof missions = []
  const dueSoon: typeof missions = []
  const overdue: typeof missions = []
  for(const m of missions.filter(m=> m.kind==='MISSION' && !m.archived && m.status!=='COMPLETED')){
    const d = deadlineInfo(m.deadline, m.status)
    if(d.state==='TODAY') dueToday.push(m)
    else if(d.state==='DUE_SOON') dueSoon.push(m)
    else if(d.state==='OVERDUE') overdue.push(m)
  }

  // crew overview stats per member
  const crewStats = allCrewForStats.map(cm=>{
    const forUser = missions.filter(m=> !m.archived && m.kind==='MISSION' && (m.assignedTo===cm.id || m.assignedTo==='ALL'))
    const getS = (m:any)=> m.assignmentType==='CREW' ? (m.memberStatuses?.[cm.id] || 'NOT_STARTED') : m.status
    return {
      user: cm,
      total: forUser.length,
      completed: forUser.filter(m=> getS(m)==='COMPLETED').length,
      inProgress: forUser.filter(m=> getS(m)==='IN_PROGRESS').length,
      overdue: forUser.filter(m=> { const s=getS(m); if(s==='COMPLETED') return false; return deadlineInfo(m.deadline,s).state==='OVERDUE'}).length,
    }
  })

  return (
    <div className="max-w-[1420px] mx-auto p-3 space-y-4">
      {/* Command header — dark navy, not personal soft */}
      <div className="rounded-[18px] overflow-hidden border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
        <div className="relative h-[190px] overflow-hidden bg-[#0a1628]">
          <div className="absolute inset-0 opacity-20">
            <OceanScene compact={false} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] via-[#0a1628]/70 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-center">
            <div className="text-[11px] tracking-[0.18em] font-bold text-sky-200">CREW COMMAND · THE VOYAGE</div>
            <div className="text-2xl font-bold text-white mt-1">Welcome, Commander {user.name} <span className="text-sm font-normal text-white/50">· {user.role} · {user.id}</span></div>
            <div className="text-sm text-white/60 mt-1 max-w-[560px]">How is the crew doing? Track active missions, deadlines, and per-member crew mission status — each member's progress is independent.</div>
            <div className="mt-4 flex gap-6">
              <Stat label="Team Completed" value={teamCompleted}/>
              <Stat label="In Progress" value={teamInProgress}/>
              <Stat label="Overdue" value={teamOverdue}/>
              <Stat label="Crew" value={crewMembers.length}/>
            </div>
          </div>
          <div className="absolute right-4 top-4 flex gap-2">
            <Link to="/control" className="px-4 py-2 rounded-full bg-white text-[#0a1628] text-xs font-bold">+ Create Mission</Link>
            <Link to="/control" className="px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-bold">Mission Control</Link>
          </div>
        </div>

        <div className="bg-[#f1f5f9] p-4 grid lg:grid-cols-12 gap-4">
          {/* LEFT: Crew Overview + Active Missions */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] tracking-[0.14em] font-bold text-slate-500">CREW OVERVIEW</span>
                <span className="text-xs text-slate-400">{crewMembers.length} members</span>
              </div>
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                {crewStats.map(s=>(
                  <div key={s.user.id} className="rounded-2xl border border-slate-200 p-3 flex gap-3 items-center bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-sm transition">
                    <div className="w-9 h-9 rounded-full grid place-items-center text-white text-xs font-bold shrink-0" style={{background:s.user.color}}>{s.user.avatar}</div>
                    <div className="min-w-0 flex-1">
                      <Link to={`/crew/${s.user.id}`} className="group inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-sky-700 hover:underline underline-offset-2">
                        {s.user.name} <span className="text-sky-600 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition">→</span> <span className="text-[10px] font-normal text-slate-500 no-underline">· {s.user.id}</span>
                      </Link>
                      <div className="text-[11px] text-slate-600">{s.total} missions · {s.completed} ✓ · {s.inProgress} ↻ · {s.overdue} ⚠</div>
                      <div className="mt-1.5 h-1 rounded-full bg-slate-200 overflow-hidden flex">
                        <div className="bg-emerald-500 h-full" style={{width: s.total? `${(s.completed/s.total)*100}%`: '0%'}}/>
                        <div className="bg-sky-500 h-full" style={{width: s.total? `${(s.inProgress/s.total)*100}%`: '0%'}}/>
                        <div className="bg-red-400 h-full" style={{width: s.total? `${(s.overdue/s.total)*100}%`: '0%'}}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="text-[11px] tracking-[0.14em] font-bold text-slate-500">ACTIVE MISSIONS · INDIVIDUAL</div>
                <div className="mt-3 space-y-2">
                  {individualMissions.slice(0,4).map(m=>(
                    <Link key={m.id} to={`/missions/${m.id}`} className="block rounded-xl border border-slate-200 p-3 hover:bg-slate-50">
                      <div className="text-xs font-bold text-slate-900 truncate">{m.title}</div>
                      <div className="text-[11px] text-slate-500">Assigned to {users.find(u=>u.id===m.assignedTo)?.name} · {m.assignedTo} · Due {new Date(m.deadline).toLocaleDateString()}</div>
                      <span className="inline-block mt-1 text-[10px] font-bold tracking-[0.08em] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">{m.status.replace('_',' ')}</span>
                    </Link>
                  ))}
                  {individualMissions.length===0 && <div className="text-xs text-slate-500">No individual active missions.</div>}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="text-[11px] tracking-[0.14em] font-bold text-slate-500">CREW MISSIONS</div>
                <div className="mt-3 space-y-2">
                  {crewMissions.slice(0,3).map(m=>(
                    <Link key={m.id} to={`/missions/${m.id}`} className="block rounded-xl border border-sky-200 bg-sky-50/40 p-3 hover:bg-sky-50">
                      <div className="text-xs font-bold text-slate-900">{m.title}</div>
                      <div className="text-[11px] text-slate-600">Entire Crew · Due {new Date(m.deadline).toLocaleDateString()}</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {crewMembers.slice(0,4).map(cm=> {
                          const s = m.memberStatuses?.[cm.id] || 'NOT_STARTED'
                          const col = s==='COMPLETED'?'text-emerald-600': s==='IN_PROGRESS'?'text-sky-600':'text-slate-400'
                          return <span key={cm.id} className={`text-[10px] ${col}`}>{cm.name}: {s==='COMPLETED'?'✓': s==='IN_PROGRESS'?'↻':'○'}</span>
                        })}
                      </div>
                    </Link>
                  ))}
                  {crewMissions.length===0 && <div className="text-xs text-slate-500">No crew-wide missions active.</div>}
                </div>
              </div>
            </div>

            {/* Crew Mission Performance detailed */}
            {crewMissions.length>0 && (
              <div className="bg-[#0a1628] rounded-2xl border border-white/10 p-4 text-white">
                <div className="text-[11px] tracking-[0.14em] font-bold text-white/50">CREW MISSION PERFORMANCE</div>
                {crewMissions.slice(0,2).map(m=>(
                  <div key={m.id} className="mt-3 rounded-xl bg-white/[0.06] border border-white/10 p-3">
                    <div className="text-xs font-bold text-white">{m.title}</div>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {users.filter(u=> ['zaid','madhu','nikhil','harika','sameer_crew','koushik'].includes(u.id)).map(u=>{
                        const s = m.memberStatuses?.[u.id] || 'NOT_STARTED'
                        const icon = s==='COMPLETED'?'✓': s==='IN_PROGRESS'?'↻':'○'
                        const col = s==='COMPLETED'?'text-emerald-300': s==='IN_PROGRESS'?'text-sky-300':'text-white/40'
                        return <div key={u.id} className={`text-xs flex gap-1.5 ${col}`}><span>{icon}</span><span>{u.name} · {u.id}</span></div>
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Deadline watch + Mission Status + Activity + Management */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-[11px] tracking-[0.14em] font-bold text-slate-500">MISSION STATUS — TEAM</div>
              <div className="mt-3 space-y-2">
                {[
                  {label:'Completed', v: teamCompleted, color:'bg-emerald-500'},
                  {label:'In Progress', v: teamInProgress, color:'bg-sky-500'},
                  {label:'Overdue', v: teamOverdue, color:'bg-red-500'},
                  {label:'Not Started', v: teamNotStarted, color:'bg-slate-300'},
                ].map(r=>(
                  <div key={r.label} className="flex items-center gap-2 text-xs"><span className={`w-2 h-2 rounded-full ${r.color}`}/><span className="flex-1 text-slate-600">{r.label}</span><span className="font-bold text-slate-900">{r.v}</span></div>
                ))}
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-100 overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{width:`${Math.max(4,(teamCompleted/Math.max(1,teamCompleted+teamInProgress+teamOverdue+teamNotStarted))*100)}%`}}/>
                <div className="bg-sky-500 h-full" style={{width:`${(teamInProgress/Math.max(1,teamCompleted+teamInProgress+teamOverdue+teamNotStarted))*100}%`}}/>
                <div className="bg-red-400 h-full" style={{width:`${(teamOverdue/Math.max(1,teamCompleted+teamInProgress+teamOverdue+teamNotStarted))*100}%`}}/>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-[11px] tracking-[0.14em] font-bold text-slate-500">DEADLINE WATCH</div>
              <div className="mt-3 space-y-3 text-xs">
                <div>
                  <div className="text-[11px] font-bold text-red-600">DUE TODAY</div>
                  <div className="mt-1 space-y-1">{dueToday.length? dueToday.map(m=> <div key={m.id} className="text-slate-700">{m.title} · {m.assignedTo}</div>) : <div className="text-slate-400">None</div>}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-amber-600">DUE SOON</div>
                  <div className="mt-1 space-y-1">{dueSoon.length? dueSoon.map(m=> <div key={m.id} className="text-slate-700">{m.title}</div>) : <div className="text-slate-400">None</div>}</div>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-red-700">OVERDUE</div>
                  <div className="mt-1 space-y-1">{overdue.length? overdue.map(m=> <div key={m.id} className="text-slate-700">{m.title} · overdue</div>) : <div className="text-slate-400">None</div>}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-[11px] tracking-[0.14em] font-bold text-slate-500">CREW ACTIVITY — team</div>
              <div className="mt-3 space-y-2 text-xs">
                {activities.slice(0,5).map(a=>(
                  <div key={a.id} className="flex gap-2"><span className="text-[11px] text-slate-400 font-mono">{a.time}</span><span className="text-slate-700">{a.userName} {a.action} {a.missionTitle}</span></div>
                ))}
              </div>
              <Link to="/log" className="inline-block mt-3 text-xs font-bold text-sky-700 hover:underline">View Captain's Log →</Link>
            </div>

            <div className="rounded-2xl bg-[#0a1628] border border-white/10 p-4 text-white">
              <div className="text-[11px] tracking-[0.14em] font-bold text-white/50">MISSION MANAGEMENT</div>
              <div className="mt-3 grid gap-2">
                <Link to="/control" className="w-full py-2.5 rounded-full bg-white text-[#0a1628] text-xs font-bold text-center">+ Create Mission</Link>
                <Link to="/control" className="w-full py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold text-center">Mission Control — Manage</Link>
                <Link to="/missions" className="w-full py-2 rounded-full bg-transparent border border-white/20 text-white/80 text-xs text-center">View All Missions</Link>
              </div>
              <div className="text-[11px] text-white/40 mt-3">Only Co-Captains see these controls. Crew cannot create/edit.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
