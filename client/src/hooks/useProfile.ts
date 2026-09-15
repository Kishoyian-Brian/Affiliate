import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import type { ProfileData } from '../types/user'
import { fetchProfile } from '../lib/api'

export function useProfile() {
  const { user: telegramUser } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchProfile()
      setProfile({
        ...data,
        user: telegramUser ? { ...data.user, ...telegramUser } : data.user,
      })
    } catch {
      setError('Could not load profile.')
    } finally {
      setLoading(false)
    }
  }, [telegramUser])

  useEffect(() => {
    void load()
  }, [load])

  return { profile, loading, error, reload: load }
}
