import { useEffect } from 'react'
import { CurrentUserRank } from '../components/leaderboard/CurrentUserRank'
import { LeaderboardTable } from '../components/leaderboard/LeaderboardTable'
import { useLeaderboard } from '../hooks/useLeaderboard'

export function LeaderboardPage() {
  const { entries, loading, error, reload } = useLeaderboard()
  const current = entries.find((entry) => entry.isCurrentUser)

  useEffect(() => {
    document.title = 'Tasklane — Leaderboard'
  }, [])

  if (loading) {
    return <div className="state-block">Loading leaderboard…</div>
  }

  if (error) {
    return (
      <section className="page">
        <div className="state-block state-error">
          <p>{error}</p>
          <button type="button" className="btn btn-secondary" onClick={() => void reload()}>
            Retry
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="page">
      <header className="page-header">
        <h1>Leaderboard</h1>
        <p>Ranked by verified earnings. Completions only count after Telegram membership check.</p>
      </header>

      <CurrentUserRank entry={current} />

      <section className="section-card">
        <header className="section-header">
          <h2>Top earners</h2>
        </header>
        <LeaderboardTable entries={entries} />
      </section>
    </section>
  )
}
