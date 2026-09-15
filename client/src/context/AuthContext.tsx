import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { telegramLogin } from '../lib/api'
import { storeEarnerSession } from '../lib/auth'
import type { UserProfile } from '../types/user'

interface AuthContextValue {
  ready: boolean
  user: UserProfile | null
  initData: string
  isAuthenticated: boolean
  isInsideTelegram: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { ready: telegramReady, user, initData, isInsideTelegram } = useTelegram()

  useEffect(() => {
    if (!telegramReady) return
    if (!isInsideTelegram || !initData || !user) return

    let cancelled = false

    void telegramLogin(initData)
      .then((tokens) => {
        if (cancelled) return
        storeEarnerSession({
          user,
          initData,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        })
      })
      .catch(() => {
        if (cancelled) return
        storeEarnerSession({ user, initData })
      })

    return () => {
      cancelled = true
    }
  }, [initData, isInsideTelegram, telegramReady, user])

  const value = useMemo(
    () => ({
      ready: telegramReady,
      user,
      initData,
      isAuthenticated: Boolean(isInsideTelegram && user),
      isInsideTelegram,
    }),
    [initData, isInsideTelegram, telegramReady, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
