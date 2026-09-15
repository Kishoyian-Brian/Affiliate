import { useCallback, useEffect, useState } from 'react'
import { fetchLeaderboard } from '../lib/api'
import { getErrorMessage } from '../lib/errors'
import type { LeaderboardEntry } from '../types/leaderboard'

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setEntries(await fetchLeaderboard())
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load leaderboard.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { entries, loading, error, reload: load }
}
