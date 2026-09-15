import { useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

export function LoginPage() {
  const { session, login, loading } = useAdminAuth()
  const location = useLocation()
  const [email, setEmail] = useState('admin@tasklane.local')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const from = (location.state as { from?: string } | null)?.from ?? '/admin'

  if (session) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
    } catch {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={(e) => void handleSubmit(e)}>
        <div className="admin-login-brand">
          <span className="admin-sidebar-mark">T</span>
          <div>
            <strong>Tasklane</strong>
            <span>Admin</span>
          </div>
        </div>
        <h1>Sign in</h1>
        <p>Platform operations — campaigns, users, withdrawals.</p>

        <label className="admin-field">
          <span>Email</span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="admin-field">
          <span>Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error ? <p className="admin-error">{error}</p> : null}

        <button type="submit" className="admin-btn admin-btn-primary admin-btn-block" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="admin-login-hint">Dev default: admin@tasklane.local / tasklane</p>
      </form>
    </div>
  )
}
