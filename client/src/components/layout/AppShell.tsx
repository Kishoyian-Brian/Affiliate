import { Link, NavLink, Outlet } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { NavIcon } from '../ui/NavIcon'
import { useTelegram } from '../../hooks/useTelegram'

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

const navItems = [
  { to: '/app', end: true, label: 'Campaigns', icon: 'tasks' as const },
  { to: '/app/wallet', label: 'Wallet', icon: 'wallet' as const },
  { to: '/app/profile', label: 'Account', icon: 'profile' as const },
]

export function AppShell() {
  const { user } = useTelegram()

  return (
    <div className="app-view">
      <header className="app-topbar">
        <Logo to="/app" />
        <Link to="/app/wallet" className="topbar-balance">
          <span className="topbar-balance-value">
            {formatMoney(user.balance, user.currency)}
          </span>
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

      <nav className="tab-bar" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'tab-item active' : 'tab-item')}
          >
            <NavIcon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
