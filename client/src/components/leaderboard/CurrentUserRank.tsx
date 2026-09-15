import type { LeaderboardEntry } from '../../types/leaderboard'
import { formatMoney } from '../../lib/format'

export function CurrentUserRank({ entry }: { entry: LeaderboardEntry | undefined }) {
  if (!entry) return null

  return (
    <section className="section-card">
      <header className="section-header">
        <h2>Your rank</h2>
      </header>
      <p className="leaderboard-self-rank">
        #{entry.rank} · {formatMoney(entry.totalEarned, entry.currency)} earned ·{' '}
        {entry.completedTasks} campaigns completed
      </p>
    </section>
  )
}
