import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '../types'
import { users } from '../data/users'

type AuthContextType = {
  user: User | null
  login: (userId: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('voyage_user')
    if (stored) {
      const found = users.find(u => u.id === stored)
      if (found) setUser(found)
    }
  }, [])

  const login = (userId: string) => {
    const found = users.find(u => u.id === userId)
    if (found) {
      localStorage.setItem('voyage_user', found.id)
      setUser(found)
    }
  }
  const logout = () => {
    localStorage.removeItem('voyage_user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be within AuthProvider')
  return ctx
}
