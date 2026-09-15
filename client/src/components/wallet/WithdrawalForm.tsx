import { useState } from 'react'
import type { WalletSummary } from '../../types/wallet'
import type { PayoutMethod } from '../../types/withdrawal'
import { formatMoney } from '../../lib/format'
import { haptic } from '../../lib/telegram'
import { useToast } from '../../hooks/useToast'
import { PayoutMethodCard, payoutMethodMeta } from './PayoutMethodCard'

interface WithdrawalFormProps {
  summary: WalletSummary
  withdrawing: boolean
  onWithdraw: (
    amount: number,
    method: PayoutMethod,
    destination: string,
  ) => Promise<{ success: boolean; message?: string }>
}

export function WithdrawalForm({ summary, withdrawing, onWithdraw }: WithdrawalFormProps) {
  const { toast } = useToast()
  const [method, setMethod] = useState<PayoutMethod>('ton')
  const [amount, setAmount] = useState('')
  const [destination, setDestination] = useState('')

  const parsedAmount = Number.parseFloat(amount) || 0
  const fee = Math.round(parsedAmount * (summary.withdrawalFeePct / 100) * 100) / 100
  const net = Math.max(0, parsedAmount - fee)
  const canWithdraw =
    parsedAmount >= summary.minWithdrawal &&
    parsedAmount <= summary.availableBalance &&
    destination.trim().length > 0

  const selectedMethod = payoutMethodMeta(method)

  async function handleSubmit() {
    haptic('medium')

    const result = await onWithdraw(parsedAmount, method, destination)

    if (result.success) {
      haptic('success')
      setAmount('')
      setDestination('')
      toast('Withdrawal request submitted. Processing usually takes 1–24 hours.', 'success')
    } else {
      haptic('error')
      toast(result.message ?? 'Withdrawal failed', 'error')
    }
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

      <PayoutMethodCard method={method} onChange={setMethod} />

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
          <button
            type="button"
            className="btn btn-secondary withdraw-max-btn"
            onClick={() => setAmount(summary.availableBalance.toFixed(2))}
          >
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
    </section>
  )
}
