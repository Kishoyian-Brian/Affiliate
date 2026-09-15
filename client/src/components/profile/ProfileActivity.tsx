import { Link } from 'react-router-dom'
import type { ProfileActivityItem, UserProfile } from '../../types/user'
import { formatDate, formatMoney } from '../../lib/format'

interface ProfileActivityProps {
  user: UserProfile
  activity: ProfileActivityItem[]
}

export function ProfileActivity({ user, activity }: ProfileActivityProps) {
  return (
    <section className="section-card">
      <header className="section-header">
        <h2>Activity</h2>
      </header>

      <div className="profile-stats-row">
        <div className="profile-stat">
          <span>Tasks completed</span>
          <strong>{user.completedTasks}</strong>
        </div>
        <div className="profile-stat">
          <span>Active referrals</span>
          <strong>{user.activeReferrals}</strong>
        </div>
        <div className="profile-stat">
          <span>Total earned</span>
          <strong>{formatMoney(user.totalEarned, user.currency)}</strong>
        </div>
      </div>

      {activity.length > 0 ? (
        <>
          <h4 className="profile-subheading">Recent</h4>
          <ul className="profile-activity-list">
            {activity.map((item) => (
              <li key={item.id}>
                <span className="profile-activity-label">{item.label}</span>
                <span className="profile-activity-date">{formatDate(item.date)}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <div className="profile-links">
        <Link to="/app/wallet">View wallet</Link>
        <Link to="/app">Browse tasks</Link>
      </div>
    </section>
  )
}
