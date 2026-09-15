import { Outlet } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { AdminSidebar } from './AdminSidebar'

export function AdminShell() {
  const { session, logout } = useAdminAuth()

  return (
    <div className="admin-app">
      <AdminSidebar />
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-title">Platform admin</div>
          <div className="admin-topbar-user">
            <span>{session?.name}</span>
            <button type="button" className="admin-btn-text" onClick={logout} aria-label="Sign out">
              Sign out
            </button>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
