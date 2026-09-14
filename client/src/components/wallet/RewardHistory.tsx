import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { RewardEntry, RewardStatus } from '../../types'
import { formatDate, formatMoney } from '../../lib/format'
import { RewardBadge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'

type HistoryFilter = 'all' | RewardStatus

const filters: Array<{ id: HistoryFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'released', label: 'Paid' },
  { id: 'held', label: 'On hold' },
  { id: 'cancelled', label: 'Cancelled' },
]

interface RewardHistoryProps {
  rewards: RewardEntry[]
}

export function RewardHistory({ rewards }: RewardHistoryProps) {
  const [filter, setFilter] = useState<HistoryFilter>('all')

  const filtered = useMemo(() => {
    const sorted = [...rewards].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    if (filter === 'all') return sorted
    return sorted.filter((r) => r.status === filter)
  }, [filter, rewards])

  return (
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

      {filtered.length === 0 ? (
        <EmptyState
          title="No rewards in this filter"
          description="Try another filter or complete a task to earn."
        />
      ) : (
        <div className="reward-list">
          {filtered.map((reward) => (
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
        Complete more tasks to earn →
      </Link>
    </section>
  )
}
