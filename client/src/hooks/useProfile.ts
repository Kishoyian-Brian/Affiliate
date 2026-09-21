import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import type { ProfileData } from '../types/user'
import { fetchProfile } from '../lib/api'

export function useProfile() {
  const { user: telegramUser, hasServerSession } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!hasServerSession) {
      setProfile(null)
      setLoading(false)
      setError('Sign in through Telegram to load your account.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await fetchProfile()
      setProfile({
        ...data,
        user: {
          ...data.user,
          ...(telegramUser
            ? {
                telegramId: telegramUser.telegramId,
                firstName: telegramUser.firstName,
                lastName: telegramUser.lastName,
                username: telegramUser.username,
                language: telegramUser.language,
              }
            : {}),
        },
      })
    } catch {
      setError('Could not load profile.')
    } finally {
      setLoading(false)
    }
  }, [hasServerSession, telegramUser])

  useEffect(() => {
    if (!hasServerSession && !telegramUser) {
      setLoading(false)
      return
    }
    void load()
  }, [hasServerSession, load, telegramUser])

  return { profile, loading, error, reload: load }
}
