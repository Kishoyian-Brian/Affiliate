import { NavLink } from 'react-router-dom'

const links = [
  { to: '/admin', end: true, label: 'Dashboard' },
  { to: '/admin/campaigns', label: 'Campaigns' },
  { to: '/admin/channels', label: 'Channels' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/withdrawals', label: 'Withdrawals' },
  { to: '/admin/settings', label: 'Settings' },
]

export function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <span className="admin-sidebar-mark">T</span>
        <div>
          <strong>Tasklane</strong>
          <span>Operations</span>
        </div>
      </div>

      <nav className="admin-sidebar-nav" aria-label="Admin navigation">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-foot">
        <a href="/app" className="admin-nav-link muted">
          Open earner app
        </a>
      </div>
    </aside>
  )
}
