import type { EarnerSession } from '../types/auth'
import type { UserProfile } from '../types/user'

const SESSION_KEY = 'tasklane_earner_session'

export function getStoredEarnerSession(): EarnerSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as EarnerSession
  } catch {
    return null
  }
}

export function storeEarnerSession(session: EarnerSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearEarnerSession() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function profileFromTelegram(
  fallback: UserProfile,
  telegramUser?: { id: number; first_name: string; username?: string },
): UserProfile {
  if (!telegramUser) return fallback
  return {
    ...fallback,
    telegramId: telegramUser.id,
    firstName: telegramUser.first_name,
    username: telegramUser.username,
  }
}
