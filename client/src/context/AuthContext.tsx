import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import type { UserProfile } from '../types/user'

interface AuthContextValue {
  ready: boolean
  user: UserProfile
  initData: string
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { ready, user, initData } = useTelegram()

  const value = useMemo(
    () => ({
      ready,
      user,
      initData,
      isAuthenticated: ready,
    }),
    [initData, ready, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
