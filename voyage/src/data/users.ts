import type { User } from '../types'

export const users: User[] = [
  { id: 'koushik', name: 'Koushik', displayName: 'Koushik', role: 'Co-Captain', currentMissionId: 'm08', avatar: 'K', color: '#0f766e', skills: ['Leadership','Strategy','Architecture'], joinedAt: '2026-01-10' },
  { id: 'sameer_cocaptain', name: 'Sameer', displayName: 'Sameer', role: 'Co-Captain', currentMissionId: 'm07', avatar: 'S', color: '#1e40af', skills: ['Product','Navigation','Planning'], joinedAt: '2026-01-10' },
  { id: 'sameer_crew', name: 'Sameer', displayName: 'Sameer', role: 'Crew Member', currentMissionId: 'm05', avatar: 'S', color: '#7c3aed', skills: ['Backend','API','Node.js'], joinedAt: '2026-02-15' },
  { id: 'zaid', name: 'Zaid', displayName: 'Zaid', role: 'Crew Member', currentMissionId: 'm04', avatar: 'Z', color: '#0e7490', skills: ['Frontend','Auth','React'], joinedAt: '2026-02-20' },
  { id: 'madhu', name: 'Madhu', displayName: 'Madhu', role: 'Crew Member', currentMissionId: 'm06', avatar: 'M', color: '#9d174d', skills: ['Database','Design','SQL'], joinedAt: '2026-03-01' },
  { id: 'nikhil', name: 'Nikhil', displayName: 'Nikhil', role: 'Crew Member', currentMissionId: 'm02', avatar: 'N', color: '#854d0e', skills: ['UI/UX','Design System','Figma'], joinedAt: '2026-03-05' },
  { id: 'harika', name: 'Harika', displayName: 'Harika', role: 'Crew Member', currentMissionId: 'm03', avatar: 'H', color: '#166534', skills: ['Frontend','Dashboard','Charts'], joinedAt: '2026-03-10' },
]

export const getUserById = (id:string) => users.find(u=>u.id===id)
