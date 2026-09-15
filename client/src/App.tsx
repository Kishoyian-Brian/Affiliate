import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminApp } from './admin/AdminApp'
import { ReferralBootstrap } from './components/referrals/ReferralBootstrap'
import { AppShell } from './components/layout/AppShell'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AppConfigProvider } from './context/AppConfigContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { HomePage } from './pages/HomePage'
import { LandingPage } from './pages/LandingPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { ProfilePage } from './pages/ProfilePage'
import { ReferralLandingPage } from './pages/ReferralLandingPage'
import { TaskDetailPage } from './pages/TaskDetailPage'
import { WalletPage } from './pages/WalletPage'

function App() {
  return (
    <AppConfigProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <ReferralBootstrap />
            <Routes>
              <Route index element={<LandingPage />} />
              <Route path="/start" element={<ReferralLandingPage />} />
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                <Route index element={<HomePage />} />
                <Route path="tasks/:taskId" element={<TaskDetailPage />} />
                <Route path="leaderboard" element={<LeaderboardPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
              <Route path="/admin/*" element={<AdminApp />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </AppConfigProvider>
  )
}

export default App
