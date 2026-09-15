import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { formatMoney } from '../../lib/format'
import { Logo } from '../brand/Logo'
import { BottomNavigation } from './BottomNavigation'

export function AppShell() {
  const { user } = useAuth()

  return (
    <div className="app-view">
      <header className="app-topbar">
        <Logo to="/app" />
        <Link to="/app/wallet" className="topbar-balance">
          <span className="topbar-balance-value">{formatMoney(user.balance, user.currency)}</span>
          {user.pendingBalance > 0 ? (
            <span className="topbar-balance-pending">
              {formatMoney(user.pendingBalance, user.currency)} pending
            </span>
          ) : null}
        </Link>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <BottomNavigation />
    </div>
  )
}
