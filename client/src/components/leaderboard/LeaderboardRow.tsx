import type { LeaderboardEntry } from '../../types/leaderboard'
import { formatMoney } from '../../lib/format'

export function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  return (
    <li className={`leaderboard-row${entry.isCurrentUser ? ' leaderboard-row-self' : ''}`}>
      <span className="leaderboard-rank">{entry.rank}</span>
      <div className="leaderboard-who">
        <strong>{entry.displayName}</strong>
        {entry.username ? <span>@{entry.username}</span> : null}
      </div>
      <div className="leaderboard-stats">
        <strong>{formatMoney(entry.totalEarned, entry.currency)}</strong>
        <span>{entry.completedTasks} completed</span>
      </div>
    </li>
  )
}
