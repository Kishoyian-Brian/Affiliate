import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { ready, isAuthenticated } = useAuth()

  if (!ready) {
    return <div className="state-block">Loading…</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}
