import { useCallback, useEffect, useRef, useState } from 'react'
import {
  useIsConnectionRestored,
  useTonConnectUI,
  useTonWallet,
} from '@tonconnect/ui-react'
import { createTonProofPayload } from '../../lib/api'
import { haptic } from '../../lib/telegram'
import { useToast } from '../../hooks/useToast'
import type { ConnectedWallet } from '../../types/wallet'
import { useAuth } from '../../hooks/useAuth'

interface ConnectWalletCardProps {
  connected: ConnectedWallet | null
  connecting: boolean
  onBound: (input: {
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
  }) => Promise<{ success: boolean; message?: string }>
  onUnbind: () => Promise<{ success: boolean; message?: string }>
}

function shortAddress(address: string) {
  if (address.length <= 14) return address
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function ConnectWalletCard({
  connected,
  connecting,
  onBound,
  onUnbind,
}: ConnectWalletCardProps) {
  const { hasServerSession, authError } = useAuth()
  const { toast } = useToast()
  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWallet()
  const restored = useIsConnectionRestored()
  const [busy, setBusy] = useState(false)
  const bindingRef = useRef(false)
  const firstProof = useRef(true)

  const prepareProof = useCallback(async () => {
    if (!hasServerSession) return
    if (firstProof.current) {
      tonConnectUI.setConnectRequestParameters({ state: 'loading' })
      firstProof.current = false
    }

    try {
      const { payload } = await createTonProofPayload()
      tonConnectUI.setConnectRequestParameters({
        state: 'ready',
        value: { tonProof: payload },
      })
    } catch {
      tonConnectUI.setConnectRequestParameters(null)
      toast('Could not prepare wallet proof. Try again.', 'error')
    }
  }, [hasServerSession, toast, tonConnectUI])

  useEffect(() => {
    if (!hasServerSession) return
    void prepareProof()
  }, [hasServerSession, prepareProof])

  useEffect(() => {
    return tonConnectUI.onStatusChange(async (next) => {
      if (!next) return
      if (bindingRef.current) return

      const tonProof = next.connectItems?.tonProof
      if (!tonProof || !('proof' in tonProof)) {
        if (tonProof && 'error' in tonProof) {
          toast('Wallet did not sign the ownership proof', 'error')
          await tonConnectUI.disconnect()
        }
        return
      }

      if (!next.account.publicKey) {
        toast('Wallet did not share a public key', 'error')
        await tonConnectUI.disconnect()
        return
      }

      bindingRef.current = true
      setBusy(true)
      try {
        const result = await onBound({
          address: next.account.address,
          network: next.account.chain,
          publicKey: next.account.publicKey,
          proof: {
            timestamp: tonProof.proof.timestamp,
            domain: tonProof.proof.domain,
            signature: tonProof.proof.signature,
            payload: tonProof.proof.payload,
            state_init: next.account.walletStateInit,
          },
          walletApp: next.name ?? next.appName,
        })

        if (!result.success) {
          haptic('error')
          toast(result.message ?? 'Could not bind wallet', 'error')
          await tonConnectUI.disconnect()
          return
        }

        haptic('success')
        toast('TON wallet connected', 'success')
      } finally {
        bindingRef.current = false
        setBusy(false)
        firstProof.current = true
        void prepareProof()
      }
    })
  }, [onBound, prepareProof, toast, tonConnectUI])

  async function handleConnect() {
    if (!hasServerSession) {
      toast(authError ?? 'Sign in through Telegram first', 'error')
      return
    }
    haptic('light')
    await prepareProof()
    await tonConnectUI.openModal()
  }

  async function handleDisconnect() {
    haptic('medium')
    setBusy(true)
    try {
      const result = await onUnbind()
      if (wallet) await tonConnectUI.disconnect()
      if (!result.success) {
        toast(result.message ?? 'Could not disconnect', 'error')
        return
      }
      toast('Wallet disconnected', 'success')
    } finally {
      setBusy(false)
      firstProof.current = true
      void prepareProof()
    }
  }

  const waiting = !restored || busy || connecting

  return (
    <section className="section-card wallet-connect-card">
      <header className="section-header">
        <h2>TON wallet</h2>
        <p>Connect inside Telegram. Tasklane never shows a site URL for this step.</p>
      </header>

      {connected ? (
        <div className="wallet-connect-bound">
          <div>
            <p className="wallet-connect-label">Connected</p>
            <p className="wallet-connect-address">{shortAddress(connected.address)}</p>
            {connected.walletApp ? (
              <p className="helper-text">{connected.walletApp}</p>
            ) : null}
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={waiting}
            onClick={() => void handleDisconnect()}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="action-block">
          <button
            type="button"
            className="btn btn-primary btn-block"
            disabled={waiting || !hasServerSession}
            onClick={() => void handleConnect()}
          >
            {waiting ? 'Connecting…' : 'Connect TON wallet'}
          </button>
          {!hasServerSession ? (
            <p className="helper-text">
              {authError ?? 'Open Tasklane from Telegram so your account can be verified.'}
            </p>
          ) : (
            <p className="helper-text">
              Telegram will ask you to launch your wallet. Confirm Launch to finish connecting.
            </p>
          )}
        </div>
      )}
    </section>
  )
}
