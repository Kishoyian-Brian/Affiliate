import { useCallback, useEffect, useState } from 'react'
import type { ConnectedWallet, WalletData } from '../types/wallet'
import {
  connectTonWallet,
  createTonProofPayload,
  disconnectTonWallet,
  fetchWallet,
  requestWithdrawal,
} from '../lib/api'
import { getErrorMessage } from '../lib/errors'
import { useAuth } from './useAuth'

export function useWallet() {
  const { hasServerSession } = useAuth()
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [withdrawing, setWithdrawing] = useState(false)
  const [connecting, setConnecting] = useState(false)

  const load = useCallback(async () => {
    if (!hasServerSession) {
      setWallet(null)
      setLoading(false)
      setError('Sign in through Telegram to load your wallet.')
      return
    }

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
  }, [hasServerSession])

  useEffect(() => {
    void load()
  }, [load, hasServerSession])

  const withdraw = useCallback(
    async (amount: number, method: 'ton' | 'usdt' | 'telegram_stars', destination: string) => {
      setWithdrawing(true)

      try {
        const result = await requestWithdrawal(amount, method, destination)
        setWallet(result)
        return { success: true as const }
      } catch (err) {
        const message = getErrorMessage(err, 'Withdrawal failed')
        return { success: false as const, message }
      } finally {
        setWithdrawing(false)
      }
    },
    [],
  )

  const bindTonWallet = useCallback(
    async (input: {
      address: string
      network: string
      publicKey: string
      proof: {
        timestamp: number
        domain: { lengthBytes: number; value: string }
        signature: string
        payload: string
        state_init?: string
      }
      walletApp?: string
    }) => {
      setConnecting(true)
      try {
        const connected = await connectTonWallet(input)
        setWallet((prev) =>
          prev
            ? { ...prev, connectedWallet: connected }
            : prev,
        )
        await load()
        return { success: true as const, connected }
      } catch (err) {
        return {
          success: false as const,
          message: getErrorMessage(err, 'Could not bind TON wallet'),
        }
      } finally {
        setConnecting(false)
      }
    },
    [load],
  )

  const unbindTonWallet = useCallback(async () => {
    setConnecting(true)
    try {
      await disconnectTonWallet()
      setWallet((prev) => (prev ? { ...prev, connectedWallet: null } : prev))
      return { success: true as const }
    } catch (err) {
      return {
        success: false as const,
        message: getErrorMessage(err, 'Could not disconnect wallet'),
      }
    } finally {
      setConnecting(false)
    }
  }, [])

  return {
    wallet,
    loading,
    error,
    withdrawing,
    connecting,
    reload: load,
    withdraw,
    createTonProofPayload,
    bindTonWallet,
    unbindTonWallet,
    connectedWallet: wallet?.connectedWallet as ConnectedWallet | null | undefined,
  }
}
