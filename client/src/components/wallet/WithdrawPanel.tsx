import { useState } from 'react'
import type { WalletSummary } from '../../types'
import { formatMoney } from '../../lib/format'
import { haptic } from '../../lib/telegram'

type PayoutMethod = 'ton' | 'usdt' | 'telegram_stars'

const methods: Array<{ id: PayoutMethod; label: string; placeholder: string }> = [
  { id: 'ton', label: 'TON', placeholder: 'UQ... wallet address' },
  { id: 'usdt', label: 'USDT', placeholder: 'TRC20 or ERC20 address' },
  { id: 'telegram_stars', label: 'Telegram Stars', placeholder: 'Your Telegram @username' },
]

interface WithdrawPanelProps {
  summary: WalletSummary
  withdrawing: boolean
  onWithdraw: (
    amount: number,
    method: PayoutMethod,
    destination: string,
  ) => Promise<{ success: boolean; message?: string }>
}

export function WithdrawPanel({ summary, withdrawing, onWithdraw }: WithdrawPanelProps) {
  const [method, setMethod] = useState<PayoutMethod>('ton')
  const [amount, setAmount] = useState('')
  const [destination, setDestination] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const parsedAmount = Number.parseFloat(amount) || 0
  const fee = Math.round(parsedAmount * (summary.withdrawalFeePct / 100) * 100) / 100
  const net = Math.max(0, parsedAmount - fee)
  const canWithdraw =
    parsedAmount >= summary.minWithdrawal &&
    parsedAmount <= summary.availableBalance &&
    destination.trim().length > 0

  const selectedMethod = methods.find((m) => m.id === method)!

  async function handleSubmit() {
    haptic('medium')
    setMessage(null)
    setSuccess(false)

    const result = await onWithdraw(parsedAmount, method, destination)

    if (result.success) {
      haptic('success')
      setSuccess(true)
      setAmount('')
      setDestination('')
      setMessage('Withdrawal request submitted. Processing usually takes 1–24 hours.')
    } else {
      haptic('error')
      setMessage(result.message ?? 'Withdrawal failed')
    }
  }

  function handleMax() {
    setAmount(summary.availableBalance.toFixed(2))
  }

  return (
    <section className="section-card withdraw-panel">
      <header className="section-header">
        <h2>Withdraw</h2>
        <p>
          Minimum {formatMoney(summary.minWithdrawal, summary.currency)} ·{' '}
          {summary.withdrawalFeePct}% processing fee
        </p>
      </header>

      <div className="withdraw-balance-row">
        <span>Available to withdraw</span>
        <strong>{formatMoney(summary.availableBalance, summary.currency)}</strong>
      </div>

      <div className="withdraw-methods" role="tablist" aria-label="Payout methods">
        {methods.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={method === item.id}
            className={method === item.id ? 'withdraw-method active' : 'withdraw-method'}
            onClick={() => setMethod(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <label className="withdraw-field">
        <span>Amount</span>
        <div className="withdraw-input-row">
          <input
            type="number"
            min={0}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
          <button type="button" className="btn btn-secondary withdraw-max-btn" onClick={handleMax}>
            Max
          </button>
        </div>
      </label>

      <label className="withdraw-field">
        <span>{selectedMethod.label} destination</span>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder={selectedMethod.placeholder}
        />
      </label>

      {parsedAmount > 0 ? (
        <div className="withdraw-summary">
          <div>
            <span>Fee ({summary.withdrawalFeePct}%)</span>
            <strong>-{formatMoney(fee, summary.currency)}</strong>
          </div>
          <div>
            <span>You receive</span>
            <strong>{formatMoney(net, summary.currency)}</strong>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="btn btn-primary btn-block"
        disabled={!canWithdraw || withdrawing}
        onClick={() => void handleSubmit()}
      >
        {withdrawing ? 'Submitting…' : `Withdraw via ${selectedMethod.label}`}
      </button>

      {parsedAmount > 0 && parsedAmount < summary.minWithdrawal ? (
        <p className="helper-text">
          Minimum withdrawal is {formatMoney(summary.minWithdrawal, summary.currency)}.
        </p>
      ) : null}

      {message ? (
        <p className={success ? 'verify-message success-text' : 'helper-text danger-text'}>{message}</p>
      ) : null}
    </section>
  )
}
