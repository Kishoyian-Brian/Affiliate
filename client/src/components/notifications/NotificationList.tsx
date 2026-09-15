import { Link } from 'react-router-dom'
import type { AppNotification } from '../../types/notification'
import { formatDateTime } from '../../lib/format'

export function NotificationList({ items }: { items: AppNotification[] }) {
  if (items.length === 0) {
    return <p className="helper-text">No notifications yet.</p>
  }

  return (
    <ul className="notification-list">
      {items.map((item) => {
        const content = (
          <>
            <strong>{item.title}</strong>
            <span>{item.body}</span>
            <time dateTime={item.createdAt}>{formatDateTime(item.createdAt)}</time>
          </>
        )

        return (
          <li key={item.id} className={item.read ? 'notification-item' : 'notification-item unread'}>
            {item.href ? (
              <Link to={item.href}>{content}</Link>
            ) : (
              <div>{content}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
