import { NavLink } from 'react-router-dom'
import { NavIcon } from '../ui/NavIcon'

const navItems = [
  { to: '/app', end: true, label: 'Campaigns', icon: 'tasks' as const },
  { to: '/app/leaderboard', label: 'Ranks', icon: 'leaderboard' as const },
  { to: '/app/wallet', label: 'Wallet', icon: 'wallet' as const },
  { to: '/app/notifications', label: 'Inbox', icon: 'notifications' as const },
  { to: '/app/profile', label: 'Account', icon: 'profile' as const },
]

export function BottomNavigation() {
  return (
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
  )
}
