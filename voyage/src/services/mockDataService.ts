import { missions } from '../data/missions'
import { users } from '../data/users'
import { activities } from '../data/activities'

export const getMissionsForUser = (userId:string) => missions.filter(m=>m.assignedTo===userId)
export const getCurrentMissionForUser = (userId:string) => missions.find(m=>m.assignedTo===userId && m.status!=='COMPLETED') || missions.find(m=>m.assignedTo===userId) || null
export const getPreviousMissionsForUser = (userId:string) => missions.filter(m=>m.assignedTo===userId && m.status==='COMPLETED')
export const getMissionById = (id:string) => missions.find(m=>m.id===id)
export const getUserById = (id:string) => users.find(u=>u.id===id)
export const getActivitiesForUser = (userId:string) => activities.filter(a=>a.userId===userId)
export const getAllMissions = () => missions
