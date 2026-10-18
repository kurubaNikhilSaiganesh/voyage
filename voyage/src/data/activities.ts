import type { Activity } from '../types'

export const activities: Activity[] = [
  { id:'a1', date:'2026-08-30', time:'22:30', userId:'zaid', userName:'Zaid', userRole:'Crew Member', missionId:'m03_completed_zaid', missionTitle:'Dashboard UI', action:'completed', detail:'Dashboard UI', timestamp:'2026-08-30T22:30:00' },
  { id:'a2', date:'2026-08-30', time:'20:15', userId:'harika', userName:'Harika', userRole:'Crew Member', missionId:'m03', missionTitle:'Dashboard UI', action:'started', detail:'Authentication', timestamp:'2026-08-30T20:15:00' },
  { id:'a3', date:'2026-08-30', time:'18:42', userId:'sameer_crew', userName:'Sameer', userRole:'Crew Member', missionId:'m05', missionTitle:'API Integration', action:'updated', detail:'API Integration', timestamp:'2026-08-30T18:42:00' },
  { id:'a4', date:'2026-08-30', time:'16:10', userId:'madhu', userName:'Madhu', userRole:'Crew Member', missionId:'m06', missionTitle:'Database Design', action:'completed', detail:'Database Design', timestamp:'2026-08-30T16:10:00' },
  { id:'a5', date:'2026-08-30', time:'14:05', userId:'koushik', userName:'Koushik', userRole:'Co-Captain', missionId:'m08', missionTitle:'Voyage Launch', action:'started', detail:'Voyage Launch', timestamp:'2026-08-30T14:05:00', deadline:'2026-09-10' },
  { id:'a6', date:'2026-08-29', time:'11:00', userId:'sameer_cocaptain', userName:'Sameer', userRole:'Co-Captain', missionId:'m07', missionTitle:'Expedition Map', action:'started', detail:'Expedition Map', timestamp:'2026-08-29T11:00:00', deadline:'2026-09-09' },
  { id:'a7', date:'2026-08-29', time:'09:30', userId:'nikhil', userName:'Nikhil', userRole:'Crew Member', missionId:'m02', missionTitle:'Design System', action:'updated', detail:'Design System', timestamp:'2026-08-29T09:30:00' },
  { id:'a8', date:'2026-08-28', time:'15:20', userId:'zaid', userName:'Zaid', userRole:'Crew Member', missionId:'m04', missionTitle:'Authentication System', action:'started', detail:'Authentication System', timestamp:'2026-08-28T15:20:00', deadline:'2026-09-05' },
]
