import type { AdminSession } from '../types'

const SESSION_KEY = 'tasklane_admin_session'

const DEMO_SESSION: AdminSession = {
  id: 'admin-1',
  name: 'Tasklane Admin',
  email: 'admin@tasklane.local',
}

export function getStoredSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AdminSession
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

export async function login(email: string, password: string): Promise<AdminSession> {
  await delay(400)

  const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? 'tasklane'
  const expectedEmail = import.meta.env.VITE_ADMIN_EMAIL ?? 'admin@tasklane.local'

  if (email !== expectedEmail || password !== expectedPassword) {
    throw new Error('Invalid email or password')
  }

  storeSession(DEMO_SESSION)
  return DEMO_SESSION
}

export function logout() {
  clearSession()
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
