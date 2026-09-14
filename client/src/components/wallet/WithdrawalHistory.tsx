import type { WithdrawalEntry } from '../../types'
import { formatDate, formatMoney } from '../../lib/format'

const methodLabels = {
  ton: 'TON',
  usdt: 'USDT',
  telegram_stars: 'Telegram Stars',
} as const

const statusLabels = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  failed: 'Failed',
} as const

interface WithdrawalHistoryProps {
  withdrawals: WithdrawalEntry[]
}

export function WithdrawalHistory({ withdrawals }: WithdrawalHistoryProps) {
  if (withdrawals.length === 0) {
    return null
  }

  const sorted = [...withdrawals].sort(
    (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
  )

  return (
    <section className="section-card">
      <header className="section-header">
        <h2>Withdrawal history</h2>
      </header>

      <div className="withdrawal-list">
        {sorted.map((entry) => (
          <article key={entry.id} className="withdrawal-item">
            <div className="withdrawal-item-body">
              <h4>
                {formatMoney(entry.amount, entry.currency)} via {methodLabels[entry.method]}
              </h4>
              <p>{entry.destination}</p>
              <p className="withdrawal-item-date">
                {formatDate(entry.requestedAt)}
                {entry.completedAt ? ` · Completed ${formatDate(entry.completedAt)}` : ''}
              </p>
            </div>
            <div className="withdrawal-item-meta">
              <span className={`withdrawal-status withdrawal-status-${entry.status}`}>
                {statusLabels[entry.status]}
              </span>
              <small>Fee {formatMoney(entry.fee, entry.currency)}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
