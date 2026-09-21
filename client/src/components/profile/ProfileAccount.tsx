import type { UserProfile } from '../../types/user'
import { formatDate } from '../../lib/format'

interface ProfileAccountProps {
  user: UserProfile
}

const statusLabels = {
  active: 'Active',
  restricted: 'Restricted',
  pending: 'Pending review',
} as const

export function ProfileAccount({ user }: ProfileAccountProps) {
  const telegramHandle = user.username ? `@${user.username}` : null
  const displayName = user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName
  const title = telegramHandle ?? displayName
  const subtitle = telegramHandle ? displayName : null
  const avatarLetter = (user.username ?? displayName).slice(0, 1).toUpperCase()

  return (
    <section className="section-card profile-account">
      <div className="profile-account-header">
        <div className="profile-avatar">{avatarLetter}</div>
        <div>
          <h3>{title}</h3>
          {subtitle ? <p className="profile-username">{subtitle}</p> : null}
        </div>
      </div>

      <dl className="profile-details">
        <div className="profile-detail-row">
          <dt>Telegram ID</dt>
          <dd>{user.telegramId}</dd>
        </div>
        <div className="profile-detail-row">
          <dt>Member since</dt>
          <dd>{formatDate(user.memberSince)}</dd>
        </div>
        <div className="profile-detail-row">
          <dt>Account status</dt>
          <dd>
            <span className={`profile-status profile-status-${user.accountStatus}`}>
              {statusLabels[user.accountStatus]}
            </span>
          </dd>
        </div>
        <div className="profile-detail-row">
          <dt>TON wallet</dt>
          <dd>{user.tonAddress ? `${user.tonAddress.slice(0, 6)}…${user.tonAddress.slice(-4)}` : 'Not connected'}</dd>
        </div>
        <div className="profile-detail-row">
          <dt>Language</dt>
          <dd>{user.language}</dd>
        </div>
      </dl>
    </section>
  )
}
