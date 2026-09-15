import { useEffect, useState } from 'react'
import { NotificationList } from '../components/notifications/NotificationList'
import { fetchNotifications } from '../lib/api'
import { getErrorMessage } from '../lib/errors'
import type { AppNotification } from '../types/notification'

export function NotificationsPage() {
  const [items, setItems] = useState<AppNotification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Tasklane — Notifications'
    void fetchNotifications()
      .then(setItems)
      .catch((err) => setError(getErrorMessage(err, 'Could not load notifications.')))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="state-block">Loading notifications…</div>
  }

  if (error) {
    return (
      <section className="page">
        <div className="state-block state-error">
          <p>{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="page">
      <header className="page-header">
        <h1>Notifications</h1>
        <p>Holds, verifications, referrals, and payouts.</p>
      </header>

      <section className="section-card">
        <NotificationList items={items} />
      </section>
    </section>
  )
}
