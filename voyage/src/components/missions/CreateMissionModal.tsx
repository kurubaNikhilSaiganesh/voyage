import { useState } from 'react'
import { useMissions } from '../../context/MissionContext'
import { users } from '../../data/users'
import { useAuth } from '../../context/AuthContext'
import { X, Ship, Anchor } from 'lucide-react'

export default function CreateMissionModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { createMission } = useMissions()
  const { user } = useAuth()
  const isCaptain = user?.role === 'Co-Captain'
  const [kind, setKind] = useState<'MISSION'|'UPDATE'>('MISSION')
  const [assignmentType, setAssignmentType] = useState<'INDIVIDUAL'|'CREW'>('INDIVIDUAL')
  const [assignedTo, setAssignedTo] = useState('zaid')
  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [objectivesRaw, setObjectivesRaw] = useState('')
  const [requirementsRaw, setRequirementsRaw] = useState('')
  const [expectedOutput, setExpectedOutput] = useState('')
  const [error, setError] = useState('')

  if (!open) return null
  if (!isCaptain) return null

  const submit = () => {
    setError('')
    if (!title.trim() || !deadline) { setError('Title and deadline required'); return }
    if (kind === 'UPDATE' && !description.trim()) { setError('Update message required'); return }
    const objectives = objectivesRaw.split('\n').map(s=>s.trim()).filter(Boolean)
    const requirements = requirementsRaw.split(',').map(s=>s.trim()).filter(Boolean)
    try {
      createMission({
        title: title.trim(),
        shortDescription: shortDescription.trim() || description.trim().slice(0,80) || title,
        description: description.trim() || title,
        why: undefined,
        objectives: kind==='UPDATE' ? [description.trim()] : objectives,
        requirements: kind==='UPDATE' ? [] : requirements,
        expectedOutput: kind==='UPDATE' ? description.trim() : expectedOutput.trim(),
        assignedTo: kind==='UPDATE' ? 'ALL' : (assignmentType==='CREW' ? 'ALL' : assignedTo),
        assignmentType: kind==='UPDATE' ? 'CREW' : assignmentType,
        kind,
        deadline,
        skills: [],
      } as any)
      // reset
      setTitle(''); setShortDescription(''); setDescription(''); setDeadline(''); setObjectivesRaw(''); setRequirementsRaw(''); setExpectedOutput('')
      onClose()
    } catch (e:any) { setError(e.message) }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-[#070f1e]/70 backdrop-blur-sm">
      <div className="w-full max-w-[640px] bg-[#f8fafc] rounded-[18px] border border-slate-200 shadow-[0_24px_64px_rgba(0,0,0,0.5)] overflow-hidden max-h-[90vh] flex flex-col">
        <div className="h-1 bg-gradient-to-r from-[#0a1628] via-[#1e6a8a] to-[#c9a86a]" />
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#0a1628] text-white grid place-items-center"><Anchor size={14}/></div>
            <div>
              <div className="text-[11px] tracking-[0.14em] font-bold text-[#0a1628]">CREATE MISSION</div>
              <div className="text-[11px] text-slate-500">Mission Control · Voyage Command</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border border-slate-200 grid place-items-center hover:bg-slate-50"><X size={14}/></button>
        </div>

        <div className="p-5 space-y-4 overflow-auto">
          {/* Kind toggle */}
          <div className="flex gap-2 p-1 rounded-full bg-slate-100 w-fit">
            <button onClick={()=>setKind('MISSION')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${kind==='MISSION'?'bg-[#0a1628] text-white':'text-slate-600'}`}>Mission</button>
            <button onClick={()=>setKind('UPDATE')} className={`px-4 py-1.5 rounded-full text-xs font-bold ${kind==='UPDATE'?'bg-[#0a1628] text-white':'text-slate-600'}`}>Crew Update</button>
          </div>

          {kind==='MISSION' && (
            <div className="rounded-2xl bg-white border border-slate-200 p-3 flex items-center gap-4">
              <div className="text-[11px] font-bold tracking-[0.12em] text-slate-500">MISSION TYPE</div>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="radio" checked={assignmentType==='INDIVIDUAL'} onChange={()=>setAssignmentType('INDIVIDUAL')} /> Individual</label>
              <label className="flex items-center gap-1.5 text-xs cursor-pointer"><input type="radio" checked={assignmentType==='CREW'} onChange={()=>setAssignmentType('CREW')} /> Entire Crew</label>
            </div>
          )}

          <div className="space-y-3">
            <label className="block">
              <span className="text-[10px] tracking-[0.12em] font-bold text-slate-500">MISSION TITLE</span>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder={kind==='UPDATE' ? "Tomorrow's meeting moved to 7 PM" : "Authentication System"} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e6a8a]/20" />
            </label>
            <label className="block">
              <span className="text-[10px] tracking-[0.12em] font-bold text-slate-500">{kind==='UPDATE' ? 'ANNOUNCEMENT' : 'SHORT DESCRIPTION'}</span>
              <input value={shortDescription} onChange={e=>setShortDescription(e.target.value)} placeholder="One-line summary" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white" />
            </label>
            <label className="block">
              <span className="text-[10px] tracking-[0.12em] font-bold text-slate-500">{kind==='UPDATE' ? 'MESSAGE' : 'DESCRIPTION'}</span>
              <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3} placeholder={kind==='UPDATE' ? "Details for crew..." : "Full mission description..."} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white" />
            </label>

            {kind==='MISSION' && assignmentType==='INDIVIDUAL' && (
              <label className="block">
                <span className="text-[10px] tracking-[0.12em] font-bold text-slate-500">ASSIGN TO</span>
                <select value={assignedTo} onChange={e=>setAssignedTo(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white">
                  {users.map(u=> <option key={u.id} value={u.id}>{u.name} — {u.role} · {u.id}</option>)}
                </select>
                <span className="text-[11px] text-slate-400">Only {users.find(u=>u.id===assignedTo)?.name} will see this as assigned individual mission.</span>
              </label>
            )}
            {kind==='MISSION' && assignmentType==='CREW' && (
              <div className="rounded-xl bg-sky-50 border border-sky-200 px-3 py-2.5 text-xs text-sky-800 flex items-center gap-2"><Ship size={14}/> Assigned to <b>Entire Crew</b> — each member gets own status/progress.</div>
            )}

            <label className="block">
              <span className="text-[10px] tracking-[0.12em] font-bold text-slate-500">DEADLINE</span>
              <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white" />
            </label>

            {kind==='MISSION' && (
              <>
                <label className="block">
                  <span className="text-[10px] tracking-[0.12em] font-bold text-slate-500">OBJECTIVES (one per line)</span>
                  <textarea value={objectivesRaw} onChange={e=>setObjectivesRaw(e.target.value)} rows={3} placeholder={"Create login page\nAdd validation\nTest flow"} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white" />
                </label>
                <label className="block">
                  <span className="text-[10px] tracking-[0.12em] font-bold text-slate-500">REQUIREMENTS (comma separated)</span>
                  <input value={requirementsRaw} onChange={e=>setRequirementsRaw(e.target.value)} placeholder="Validation, Mock auth, Session" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white" />
                </label>
                <label className="block">
                  <span className="text-[10px] tracking-[0.12em] font-bold text-slate-500">EXPECTED OUTPUT</span>
                  <input value={expectedOutput} onChange={e=>setExpectedOutput(e.target.value)} placeholder="A working authentication system" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white" />
                </label>
              </>
            )}
          </div>

          {error && <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">{error}</div>}
        </div>

        <div className="p-4 border-t border-slate-200 bg-white flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-full border border-slate-200 text-sm font-semibold bg-white">Cancel</button>
          <button onClick={submit} className="px-5 py-2 rounded-full bg-[#0a1628] text-white text-sm font-bold hover:bg-[#132a47]">Create {kind==='UPDATE' ? 'Update' : 'Mission'}</button>
        </div>
      </div>
    </div>
  )
}
