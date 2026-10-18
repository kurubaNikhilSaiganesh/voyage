export function deadlineInfo(deadline: string, status: string) {
  const d = new Date(deadline + 'T23:59:59')
  const today = new Date(); today.setHours(0,0,0,0)
  const deadlineDay = new Date(d); deadlineDay.setHours(0,0,0,0)
  const diff = Math.ceil((deadlineDay.getTime() - today.getTime()) / (1000*60*60*24))
  let label = ''
  let state: 'FUTURE'|'DUE_SOON'|'TODAY'|'OVERDUE'|'COMPLETED' = 'FUTURE'
  if (status === 'COMPLETED') { state='COMPLETED'; label=`${diff>=0 ? `${diff} days` : `${Math.abs(diff)} days overdue at completion`}` }
  else if (diff < 0) { state='OVERDUE'; label='Overdue' }
  else if (diff === 0) { state='TODAY'; label='Due Today' }
  else if (diff <= 3) { state='DUE_SOON'; label=`${diff} day${diff>1?'s':''} remaining` }
  else { state='FUTURE'; label=`${diff} days remaining` }
  const formatted = new Date(deadline).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric'})
  return { diff, state, label, formatted }
}

export function DeadlineBadge({ deadline, status, completionDate, variant='default' }: { deadline:string, status:string, completionDate?:string, variant?:'default'|'compact' }){
  const info = deadlineInfo(deadline, status)
  if(variant==='compact'){
    const tone = info.state==='OVERDUE' ? 'text-red-600' : info.state==='DUE_SOON' || info.state==='TODAY' ? 'text-amber-600' : info.state==='COMPLETED' ? 'text-emerald-600' : 'text-slate-600'
    return (
      <div className={`text-[11px] leading-tight ${tone}`}>
        <span>📅 {info.formatted}</span>
        <span className="mx-1.5 opacity-30">·</span>
        <span className="font-semibold">{info.state==='COMPLETED' ? `Completed ${completionDate ? new Date(completionDate).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : ''}` : info.state==='OVERDUE' ? 'Overdue' : info.state==='TODAY' ? 'Due Today' : `⏳ ${info.label}`}</span>
      </div>
    )
  }
  const styles:Record<string,string> = {
    FUTURE: 'bg-slate-50 border-slate-200 text-slate-700',
    DUE_SOON: 'bg-amber-50 border-amber-200 text-amber-800',
    TODAY: 'bg-amber-100 border-amber-300 text-amber-900',
    OVERDUE: 'bg-red-50 border-red-200 text-red-700',
    COMPLETED: 'bg-emerald-50 border-emerald-200 text-emerald-700'
  }
  return (
    <div className={`rounded-xl border px-3 py-2.5 inline-flex flex-col gap-0.5 ${styles[info.state]}`}>
      <span className="text-[9px] tracking-[0.14em] font-bold opacity-60">DEADLINE</span>
      <span className="text-[13px] font-medium">📅 {info.formatted}</span>
      <span className="text-[12px] font-bold">
        {info.state==='COMPLETED' ? `✓ Completed ${completionDate ? new Date(completionDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : ''}` : info.state==='OVERDUE' ? '⏰ Overdue' : info.state==='TODAY' ? '⏰ Due Today' : `⏳ ${info.label}`}
      </span>
    </div>
  )
}
