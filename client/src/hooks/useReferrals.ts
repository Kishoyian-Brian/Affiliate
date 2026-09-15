import { useCallback, useEffect, useState } from 'react'
import { fetchReferralHistory, fetchReferralProgress } from '../lib/api'
import { getErrorMessage } from '../lib/errors'
import type { ReferralProgress, ReferralRecord } from '../types/referral'

export function useReferrals(taskId?: string) {
  const [progress, setProgress] = useState<ReferralProgress | null>(null)
  const [history, setHistory] = useState<ReferralRecord[]>([])
  const [loading, setLoading] = useState(Boolean(taskId))
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!taskId) return
    setLoading(true)
    setError(null)
    try {
      const [nextProgress, nextHistory] = await Promise.all([
        fetchReferralProgress(taskId),
        fetchReferralHistory(taskId),
      ])
      setProgress(nextProgress ?? null)
      setHistory(nextHistory)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load referrals.'))
    } finally {
      setLoading(false)
    }
  }, [taskId])

  useEffect(() => {
    void load()
  }, [load])

  return { progress, history, loading, error, reload: load }
}
