import { useEffect, useMemo, useState } from 'react'
import { TaskCard } from '../components/tasks/TaskCard'
import { EmptyState } from '../components/ui/EmptyState'
import { useTasks } from '../hooks/useTasks'
import type { TaskType } from '../types'

const filters: Array<{ id: 'all' | TaskType; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'subscribe', label: 'Subscribe' },
  { id: 'referral', label: 'Referral' },
]

export function HomePage() {
  const { tasks, completions, loading, error, reload } = useTasks()
  const [filter, setFilter] = useState<'all' | TaskType>('all')

  const filteredTasks = useMemo(() => {
    const list = filter === 'all' ? tasks : tasks.filter((task) => task.type === filter)
    return [...list].sort((a, b) => a.slotsRemaining / a.slotsTotal - b.slotsRemaining / b.slotsTotal)
  }, [filter, tasks])

  useEffect(() => {
    document.title = 'Tasklane — Campaigns'
  }, [])

  return (
    <section className="page">
      <header className="page-header">
        <h1>Campaigns</h1>
        <p>
          {loading
            ? 'Loading…'
            : `${tasks.length} open campaign${tasks.length === 1 ? '' : 's'} · Verified via Telegram`}
        </p>
      </header>

      <div className="segmented-control" role="tablist" aria-label="Campaign filters">
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

      {loading ? <div className="state-block">Loading campaigns…</div> : null}

      {error ? (
        <div className="state-block state-error">
          <p>{error}</p>
          <button type="button" className="btn btn-secondary" onClick={() => void reload()}>
            Retry
          </button>
        </div>
      ) : null}

      {!loading && !error && filteredTasks.length === 0 ? (
        <EmptyState
          title={filter === 'all' ? 'No campaigns available' : `No ${filter} campaigns`}
          description={
            filter === 'all'
              ? 'New campaigns will appear here when channel owners publish them.'
              : 'Try another filter or check back later.'
          }
        />
      ) : null}

      {!loading && !error && filteredTasks.length > 0 ? (
        <div className="list-card">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} completion={completions[task.id]} />
          ))}
        </div>
      ) : null}
    </section>
  )
}
