import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function TelegramRedirect() {
  const { isInsideTelegram } = useAuth()
  const location = useLocation()

  const inMiniApp = location.pathname.startsWith('/app')
  const inAdmin = location.pathname.startsWith('/admin')

  if (isInsideTelegram && !inMiniApp && !inAdmin) {
    return <Navigate to="/app" replace />
  }

  return null
}
