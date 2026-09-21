import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useTelegram } from '../hooks/useTelegram'
import { telegramLogin } from '../lib/api'
import { storeEarnerSession } from '../lib/auth'
import type { UserProfile } from '../types/user'

interface AuthContextValue {
  ready: boolean
  user: UserProfile | null
  initData: string
  accessToken: string | null
  isAuthenticated: boolean
  hasServerSession: boolean
  isInsideTelegram: boolean
  authError: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { ready: telegramReady, user, initData, isInsideTelegram } = useTelegram()
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [loginReady, setLoginReady] = useState(false)

  useEffect(() => {
    if (!telegramReady) return

    if (!isInsideTelegram || !initData || !user) {
      setAccessToken(null)
      setAuthError(null)
      setLoginReady(true)
      return
    }

    let cancelled = false
    setLoginReady(false)
    setAuthError(null)

    void telegramLogin(initData)
      .then((tokens) => {
        if (cancelled) return
        storeEarnerSession({
          user,
          initData,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        })
        setAccessToken(tokens.accessToken)
        setLoginReady(true)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        storeEarnerSession({ user, initData })
        setAccessToken(null)
        setAuthError(error instanceof Error ? error.message : 'Could not verify Telegram login')
        setLoginReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [initData, isInsideTelegram, telegramReady, user])

  const value = useMemo(
    () => ({
      ready: telegramReady && loginReady,
      user,
      initData,
      accessToken,
      isAuthenticated: Boolean(isInsideTelegram && user),
      hasServerSession: Boolean(accessToken),
      isInsideTelegram,
      authError,
    }),
    [accessToken, authError, initData, isInsideTelegram, loginReady, telegramReady, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
