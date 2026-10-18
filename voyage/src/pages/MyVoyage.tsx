import { useAuth } from '../context/AuthContext'
import CrewDashboard from './dashboards/CrewDashboard'
import CoCaptainDashboard from './dashboards/CoCaptainDashboard'

export default function MyVoyage(){
  const { user } = useAuth()
  if(!user) return null
  if(user.role === 'Co-Captain') return <CoCaptainDashboard />
  return <CrewDashboard />
}
