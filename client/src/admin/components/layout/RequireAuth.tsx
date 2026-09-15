import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session } = useAdminAuth()
  const location = useLocation()

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return children
}
