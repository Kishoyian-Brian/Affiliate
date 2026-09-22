import type { AdminSession } from '../types'
import { ApiError } from '../../lib/errors'
import { normalizeApiBase } from '../../lib/api'

const SESSION_KEY = 'tasklane_admin_session'
const API_BASE = normalizeApiBase(import.meta.env.VITE_API_URL)

export function getStoredSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as AdminSession
    if (!session.accessToken) return null
    return session
  } catch {
    return null
  }
}

export function storeSession(session: AdminSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function getAdminAccessToken() {
  return getStoredSession()?.accessToken
}

export async function login(email: string, password: string): Promise<AdminSession> {
  const response = await fetch(`${API_BASE}/api/v1/auth/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new ApiError(await parseAdminError(response, 'Invalid email or password'))
  }

  const body = (await response.json()) as {
    accessToken: string
    refreshToken: string
    admin: { id: string; name: string; email: string }
  }

  const session: AdminSession = {
    id: body.admin.id,
    name: body.admin.name,
    email: body.admin.email,
    accessToken: body.accessToken,
    refreshToken: body.refreshToken,
  }
  storeSession(session)
  return session
}

export function logout() {
  clearSession()
}

async function parseAdminError(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as { message?: string | string[] }
    if (Array.isArray(body.message)) return body.message.join(', ')
    if (typeof body.message === 'string') return body.message
  } catch {
    /* ignore */
  }
  return fallback
}
