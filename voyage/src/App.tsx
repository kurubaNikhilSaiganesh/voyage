import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { MissionProvider } from './context/MissionContext'
import Navbar from './components/navigation/Navbar'
import Login from './pages/Login'
import MyVoyage from './pages/MyVoyage'
import Missions from './pages/Missions'
import MissionDetails from './pages/MissionDetails'
import Expedition from './pages/Expedition'
import CaptainLog from './pages/CaptainLog'
import Crew from './pages/Crew'
import CrewMember from './pages/CrewMember'
import Achievements from './pages/Achievements'
import Profile from './pages/Profile'
import MissionControl from './pages/MissionControl'

function Protected({ children }: { children: React.ReactNode }){
  const { user } = useAuth()
  if(!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function Shell({ children }: { children: React.ReactNode }){
  const { user } = useAuth()
  return (
    <div className="min-h-screen bg-[#070f1e] text-slate-900">
      {user && <Navbar/>}
      <div className={user ? 'pb-[56px] lg:pb-0' : ''}>
        {children}
      </div>
    </div>
  )
}

function AppRoutes(){
  const { user } = useAuth()
  return (
    <Shell>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace/> : <Login/>} />
        <Route path="/" element={<Protected><MyVoyage/></Protected>} />
        <Route path="/missions" element={<Protected><Missions/></Protected>} />
        <Route path="/missions/:id" element={<Protected><MissionDetails/></Protected>} />
        <Route path="/expedition" element={<Protected><Expedition/></Protected>} />
        <Route path="/log" element={<Protected><CaptainLog/></Protected>} />
        <Route path="/crew" element={<Protected><Crew/></Protected>} />
        <Route path="/crew/:id" element={<Protected><CrewMember/></Protected>} />
        <Route path="/achievements" element={<Protected><Achievements/></Protected>} />
        <Route path="/profile" element={<Protected><Profile/></Protected>} />
        <Route path="/control" element={<Protected><MissionControl/></Protected>} />
        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>
    </Shell>
  )
}

export default function App(){
  return (
    <AuthProvider>
      <MissionProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <AppRoutes/>
        </BrowserRouter>
      </MissionProvider>
    </AuthProvider>
  )
}
