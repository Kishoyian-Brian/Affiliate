import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { ready, isAuthenticated, isInsideTelegram } = useAuth()

  if (isAuthenticated) {
    return children
  }

  if (!ready || isInsideTelegram) {
    return (
      <div className="state-block">
        {isInsideTelegram ? 'Opening Tasklane…' : 'Loading…'}
      </div>
    )
  }

  return <Navigate to="/" replace />
}
