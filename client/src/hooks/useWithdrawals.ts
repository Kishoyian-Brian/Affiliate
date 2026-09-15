import { useCallback, useEffect, useState } from 'react'
import { fetchWallet } from '../lib/api'
import { getErrorMessage } from '../lib/errors'
import type { WithdrawalEntry } from '../types/withdrawal'

export function useWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const wallet = await fetchWallet()
      setWithdrawals(wallet.withdrawals)
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load withdrawals.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { withdrawals, loading, error, reload: load }
}
