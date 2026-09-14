import { Link } from 'react-router-dom'
import type { RewardEntry } from '../../types'
import { formatDateTime, formatMoney } from '../../lib/format'
import { formatTimeRemaining } from '../../lib/time'
import { RewardBadge } from '../ui/Badge'

interface PendingRewardsProps {
  rewards: RewardEntry[]
}

export function PendingRewards({ rewards }: PendingRewardsProps) {
  const pending = rewards.filter((r) => r.status === 'held' || r.status === 'pending')

  if (pending.length === 0) {
    return (
      <section className="section-card">
        <header className="section-header">
          <h2>Pending rewards</h2>
          <p>Rewards waiting for hold period or milestone completion.</p>
        </header>
        <div className="wallet-empty-inline">
          <p>No pending rewards right now. Complete a task to start earning.</p>
          <Link to="/app" className="btn btn-secondary">
            Browse tasks
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section-card">
      <header className="section-header">
        <h2>Pending rewards</h2>
        <p>Stay subscribed — leaving a channel before hold ends may cancel these.</p>
      </header>

      <div className="pending-reward-list">
        {pending.map((reward) => (
          <article key={reward.id} className="pending-reward-item">
            <div className="pending-reward-top">
              <div>
                <span className="task-type-pill">
                  {reward.taskType === 'referral' ? 'Referral' : 'Subscribe'}
                </span>
                <h4>{reward.taskTitle}</h4>
                {reward.note ? <p className="pending-reward-note">{reward.note}</p> : null}
              </div>
              <div className="pending-reward-meta">
                <strong>{formatMoney(reward.amount, reward.currency)}</strong>
                <RewardBadge status={reward.status} />
              </div>
            </div>

            <div className="pending-reward-footer">
              {reward.holdReleaseAt ? (
                <span className="pending-timer">{formatTimeRemaining(reward.holdReleaseAt)}</span>
              ) : null}
              {reward.holdReleaseAt ? (
                <span className="pending-date">Unlocks {formatDateTime(reward.holdReleaseAt)}</span>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
