import type { ReferralRecord } from '../../types/referral'
import { formatDate } from '../../lib/format'

export function ReferralHistory({ records }: { records: ReferralRecord[] }) {
  if (records.length === 0) return null

  return (
    <div className="referral-history">
      <h3 className="referral-history-title">Referrals</h3>
      <ul className="referral-history-list">
        {records.map((record) => (
          <li key={record.id}>
            <span>{record.referredDisplayName}</span>
            <span className={`referral-history-status referral-history-status-${record.status}`}>
              {record.status}
            </span>
            <time dateTime={record.createdAt}>{formatDate(record.createdAt)}</time>
          </li>
        ))}
      </ul>
    </div>
  )
}
