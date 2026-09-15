import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminShell } from './components/layout/AdminShell'
import { RequireAuth } from './components/layout/RequireAuth'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { CampaignCreatePage } from './pages/CampaignCreatePage'
import { CampaignDetailPage } from './pages/CampaignDetailPage'
import { CampaignEditPage } from './pages/CampaignEditPage'
import { CampaignListPage } from './pages/CampaignListPage'
import { ChannelsPage } from './pages/ChannelsPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { SettingsPage } from './pages/SettingsPage'
import { UsersPage } from './pages/UsersPage'
import { WithdrawalsPage } from './pages/WithdrawalsPage'
import './styles/admin.css'

export function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <AdminShell />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="campaigns" element={<CampaignListPage />} />
          <Route path="campaigns/new" element={<CampaignCreatePage />} />
          <Route path="campaigns/:id" element={<CampaignDetailPage />} />
          <Route path="campaigns/:id/edit" element={<CampaignEditPage />} />
          <Route path="channels" element={<ChannelsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="withdrawals" element={<WithdrawalsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminAuthProvider>
  )
}
