import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminApp } from './admin/AdminApp'
import { ReferralBootstrap } from './components/ReferralBootstrap'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { LandingPage } from './pages/LandingPage'
import { ProfilePage } from './pages/ProfilePage'
import { ReferralLandingPage } from './pages/ReferralLandingPage'
import { TaskDetailPage } from './pages/TaskDetailPage'
import { WalletPage } from './pages/WalletPage'

function App() {
  return (
    <BrowserRouter>
      <ReferralBootstrap />
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="/start" element={<ReferralLandingPage />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="tasks/:taskId" element={<TaskDetailPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
