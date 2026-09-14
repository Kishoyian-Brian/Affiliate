import { useCallback, useEffect, useState } from 'react'
import type { WalletData } from '../types'
import { fetchWallet, requestWithdrawal } from '../lib/api'

export function useWallet() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [withdrawing, setWithdrawing] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchWallet()
      setWallet(data)
    } catch {
      setError('Could not load wallet. Pull to refresh.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const withdraw = useCallback(
    async (amount: number, method: 'ton' | 'usdt' | 'telegram_stars', destination: string) => {
      setWithdrawing(true)

      try {
        const result = await requestWithdrawal(amount, method, destination)
        setWallet(result)
        return { success: true as const }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Withdrawal failed'
        return { success: false as const, message }
      } finally {
        setWithdrawing(false)
      }
    },
    [],
  )

  return { wallet, loading, error, withdrawing, reload: load, withdraw }
}
