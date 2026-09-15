import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { getStoredSession, login as authLogin, logout as authLogout } from '../lib/auth'
import type { AdminSession } from '../types'

interface AdminAuthContextValue {
  session: AdminSession | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(() => getStoredSession())
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const next = await authLogin(email, password)
      setSession(next)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authLogout()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({ session, loading, login, logout }),
    [session, loading, login, logout],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
