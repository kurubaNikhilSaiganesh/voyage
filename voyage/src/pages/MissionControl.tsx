import { useState } from 'react'
import { useMissions } from '../context/MissionContext'
import { useAuth } from '../context/AuthContext'
import { users } from '../data/users'
import CreateMissionModal from '../components/missions/CreateMissionModal'
import { DeadlineBadge } from '../components/missions/DeadlineBadge'
import { Link, Navigate } from 'react-router-dom'
import { Pencil, Archive, Trash2, Search } from 'lucide-react'

export default function MissionControl(){
  const { missions, updateMission, archiveMission, deleteMission } = useMissions()
  const { user } = useAuth()
  const [filter, setFilter] = useState<'all'|'individual'|'crew'|'active'|'completed'|'overdue'|'updates'>('all')
  const [q, setQ] = useState('')
  const [openCreate, setOpenCreate] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDeadline, setEditDeadline] = useState('')
  const [editAssign, setEditAssign] = useState('')

  if (user?.role !== 'Co-Captain') return <Navigate to="/" replace />

  let list = [...missions]
  if (filter==='individual') list = list.filter(m=>m.assignmentType==='INDIVIDUAL' && m.kind==='MISSION')
  if (filter==='crew') list = list.filter(m=>m.assignmentType==='CREW' && m.kind==='MISSION')
  if (filter==='updates') list = list.filter(m=>m.kind==='UPDATE')
  if (filter==='active') list = list.filter(m=>m.status!=='COMPLETED' && m.kind==='MISSION')
  if (filter==='completed') list = list.filter(m=> {
    if (m.assignmentType==='CREW') return Object.values(m.memberStatuses||{}).some(s=>s==='COMPLETED')
    return m.status==='COMPLETED'
  })
  if (filter==='overdue') list = list.filter(m=>{
    const diff = Math.ceil((new Date(m.deadline+'T23:59:59').getTime() - new Date().setHours(0,0,0,0))/(86400000))
    return diff<0 && m.status!=='COMPLETED'
  })
  if (q) list = list.filter(m=> m.title.toLowerCase().includes(q.toLowerCase()))

  const startEdit = (m:any) => { setEditing(m.id); setEditTitle(m.title); setEditDeadline(m.deadline); setEditAssign(m.assignedTo) }
  const saveEdit = (id:string) => {
    const patch:any = { title: editTitle, deadline: editDeadline }
    if (editAssign) patch.assignedTo = editAssign
    updateMission(id, patch)
    setEditing(null)
  }

  return (
    <div className="min-h-screen">
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-[#0a1628] text-white grid place-items-center text-[10px] font-bold">⚓</span>
          <span className="text-[11px] tracking-[0.16em] font-bold text-white">MISSION CONTROL</span>
          <span className="text-[10px] text-white/40">Create · Assign · Manage</span>
        </div>
      </div>
      <div className="max-w-[1160px] mx-auto p-3">
        <div className="bg-[#f8fafc] rounded-[18px] border border-slate-200 shadow-[0_16px_48px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#0a1628] via-[#1e6a8a] to-[#c9a86a]" />
          <div className="p-4 lg:p-6">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-slate-900">Mission Control</h1>
                <p className="text-xs text-slate-500">Only Co-Captains can manage. No source-file editing required.</p>
              </div>
              <button onClick={()=>setOpenCreate(true)} className="px-5 py-2.5 rounded-full bg-[#0a1628] text-white text-sm font-bold hover:bg-[#132a47]">+ Create Mission</button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 items-center">
              {(['all','individual','crew','active','completed','overdue','updates'] as const).map(k=>(
                <button key={k} onClick={()=>setFilter(k)} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${filter===k?'bg-[#0a1628] text-white border-[#0a1628]':'bg-white text-slate-700 border-slate-200'}`}>{k.toUpperCase()}</button>
              ))}
              <div className="ml-auto flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1.5">
                <Search size={14} className="text-slate-400"/>
                <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search missions..." className="text-xs bg-transparent outline-none w-[160px]" />
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {list.length===0 && <div className="text-sm text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">No missions in this filter.</div>}
              {list.map(m=>{
                const assignee = m.assignedTo==='ALL' ? { name:'Entire Crew', id:'ALL' } as any : users.find(u=>u.id===m.assignedTo)
                return (
                  <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition">
                    {editing===m.id ? (
                      <div className="space-y-2">
                        <input value={editTitle} onChange={e=>setEditTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                        <div className="flex gap-2">
                          <input type="date" value={editDeadline} onChange={e=>setEditDeadline(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                          {m.assignmentType==='INDIVIDUAL' && (
                            <select value={editAssign} onChange={e=>setEditAssign(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
                              {users.map(u=> <option key={u.id} value={u.id}>{u.name} · {u.id}</option>)}
                            </select>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button onClick={()=>saveEdit(m.id)} className="px-3 py-1.5 rounded-full bg-[#0a1628] text-white text-xs font-bold">Save</button>
                          <button onClick={()=>setEditing(null)} className="px-3 py-1.5 rounded-full border border-slate-200 text-xs">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] font-bold tracking-[0.12em] px-2 py-0.5 rounded-full border ${m.kind==='UPDATE'?'bg-amber-50 text-amber-700 border-amber-200': m.assignmentType==='CREW'?'bg-sky-50 text-sky-700 border-sky-200':'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                {m.kind==='UPDATE' ? 'CREW UPDATE' : m.assignmentType}
                              </span>
                              <span className={`text-[9px] font-bold tracking-[0.12em] px-2 py-0.5 rounded-full border ${m.status==='COMPLETED'?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-white text-slate-600 border-slate-200'}`}>{m.status.replace('_',' ')}</span>
                              {m.assignmentType==='CREW' && m.kind==='MISSION' && (
                                <span className="text-[10px] text-slate-500">Per-member status: {Object.keys(m.memberStatuses||{}).length} tracked</span>
                              )}
                            </div>
                            <Link to={`/missions/${m.id}`} className="block text-[14px] font-bold text-slate-900 mt-1 hover:underline">{m.title}</Link>
                            <div className="text-xs text-slate-500 line-clamp-1">{m.shortDescription}</div>
                          </div>
                          <div className="flex gap-1.5 shrink-0">
                            <button onClick={()=>startEdit(m)} className="w-8 h-8 rounded-full border border-slate-200 grid place-items-center hover:bg-slate-50"><Pencil size={12}/></button>
                            <button onClick={()=>archiveMission(m.id)} className="w-8 h-8 rounded-full border border-slate-200 grid place-items-center hover:bg-slate-50"><Archive size={12}/></button>
                            <button onClick={()=>{ if(confirm('Delete mission?')) deleteMission(m.id)}} className="w-8 h-8 rounded-full border border-red-200 text-red-600 grid place-items-center hover:bg-red-50"><Trash2 size={12}/></button>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 items-center text-xs">
                          <DeadlineBadge deadline={m.deadline} status={m.status} completionDate={m.completionDate} variant="compact"/>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-600">{m.assignedTo==='ALL' ? 'All Crew' : `${assignee?.name} · ${assignee?.id} (${assignee?.role})`}</span>
                        </div>
                        {m.assignmentType==='CREW' && m.kind==='MISSION' && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {users.filter(u=> u.id!=='koushik' && true).slice(0,6).map(u=>{
                              const s = m.memberStatuses?.[u.id] || 'NOT_STARTED'
                              const color = s==='COMPLETED'?'bg-emerald-100 text-emerald-700 border-emerald-200': s==='IN_PROGRESS'?'bg-sky-100 text-sky-700 border-sky-200':'bg-slate-50 text-slate-500 border-slate-200'
                              return <span key={u.id} className={`text-[10px] px-2 py-1 rounded-full border ${color}`}>{u.name}: {s.replace('_',' ')}</span>
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <CreateMissionModal open={openCreate} onClose={()=>setOpenCreate(false)} />
    </div>
  )
}
