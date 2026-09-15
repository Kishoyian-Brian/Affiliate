import type { LeaderboardEntry } from '../../types/leaderboard'
import { LeaderboardRow } from './LeaderboardRow'

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <ol className="leaderboard-table">
      {entries.map((entry) => (
        <LeaderboardRow key={entry.telegramId} entry={entry} />
      ))}
    </ol>
  )
}
