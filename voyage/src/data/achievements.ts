import type { Achievement } from '../types'
export const achievements: Achievement[] = [
  { id:'ach1', title:'First Mission', icon:'⚓', description:'Completed your first mission', criteria:'Complete 1 mission', unlockedFor:['zaid','harika','madhu','koushik','sameer_crew','sameer_cocaptain','nikhil']},
  { id:'ach2', title:'Navigator', icon:'🧭', description:'Completed multiple missions', criteria:'Complete 3 missions', unlockedFor:['zaid','koushik','madhu']},
  { id:'ach3', title:'Open Waters', icon:'🌊', description:'Worked across multiple project areas', criteria:'Work on 2+ distinct areas', unlockedFor:['harika','madhu','nikhil']},
  { id:'ach4', title:'Destination', icon:'🏝', description:'Completed a major mission', criteria:'Complete a milestone mission', unlockedFor:['zaid','koushik']},
]
