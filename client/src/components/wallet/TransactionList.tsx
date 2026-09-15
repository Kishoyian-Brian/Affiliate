import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { RewardEntry, RewardStatus } from '../../types/wallet'
import type { WithdrawalEntry } from '../../types/withdrawal'
import { formatDate, formatMoney } from '../../lib/format'
import { RewardBadge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'

const methodLabels = {
  ton: 'TON',
  usdt: 'USDT',
  telegram_stars: 'Telegram Stars',
} as const

const withdrawalStatusLabels = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  failed: 'Failed',
} as const

type HistoryFilter = 'all' | RewardStatus

const filters: Array<{ id: HistoryFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'released', label: 'Paid' },
  { id: 'held', label: 'On hold' },
  { id: 'cancelled', label: 'Cancelled' },
]

interface TransactionListProps {
  rewards: RewardEntry[]
  withdrawals: WithdrawalEntry[]
}

export function TransactionList({ rewards, withdrawals }: TransactionListProps) {
  const [filter, setFilter] = useState<HistoryFilter>('all')

  const filteredRewards = useMemo(() => {
    const sorted = [...rewards].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    if (filter === 'all') return sorted
    return sorted.filter((r) => r.status === filter)
  }, [filter, rewards])

  const sortedWithdrawals = [...withdrawals].sort(
    (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
  )

  return (
    <>
      <section className="section-card">
        <header className="section-header">
          <h2>Reward history</h2>
          <p>All rewards from completed and in-progress campaigns.</p>
        </header>

        <div className="segmented-control" role="tablist" aria-label="Reward filters">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              className={filter === item.id ? 'segment active' : 'segment'}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {filteredRewards.length === 0 ? (
          <EmptyState
            title="No rewards in this filter"
            description="Try another filter or complete a task to earn."
          />
        ) : (
          <div className="reward-list">
            {filteredRewards.map((reward) => (
              <article key={reward.id} className="reward-item reward-item-rich">
                <div className="reward-item-body">
                  <span className="reward-item-type">
                    {reward.taskType === 'referral' ? 'Referral' : 'Subscribe'}
                  </span>
                  <h4>{reward.taskTitle}</h4>
                  <p>
                    {formatDate(reward.createdAt)}
                    {reward.releasedAt ? ` · Paid ${formatDate(reward.releasedAt)}` : ''}
                  </p>
                  {reward.note ? <p className="reward-item-note">{reward.note}</p> : null}
                </div>
                <div className="reward-item-meta">
                  <strong>{formatMoney(reward.amount, reward.currency)}</strong>
                  <RewardBadge status={reward.status} />
                </div>
              </article>
            ))}
          </div>
        )}

        <Link to="/app" className="wallet-browse-link">
          Complete more campaigns to earn →
        </Link>
      </section>

      {sortedWithdrawals.length > 0 ? (
        <section className="section-card">
          <header className="section-header">
            <h2>Withdrawal history</h2>
          </header>
          <div className="withdrawal-list">
            {sortedWithdrawals.map((entry) => (
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
                    {withdrawalStatusLabels[entry.status]}
                  </span>
                  <small>Fee {formatMoney(entry.fee, entry.currency)}</small>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </>
  )
}
