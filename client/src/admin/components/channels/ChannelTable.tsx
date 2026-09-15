import { AdminTable } from '../ui/AdminTable'
import { formatDateTime, formatNumber } from '../../lib/format'
import type { ChannelRecord } from '../../types'

interface ChannelTableProps {
  channels: ChannelRecord[]
  testing: string | null
  onTest: (username: string) => void
}

export function ChannelTable({ channels, testing, onTest }: ChannelTableProps) {
  return (
    <AdminTable label="Channels table" minWidth={880} scrollable>
      <thead>
        <tr>
          <th scope="col" className="col-primary">
            Channel
          </th>
          <th scope="col" className="col-num">
            Members
          </th>
          <th scope="col">Bot access</th>
          <th scope="col">Last checked</th>
          <th scope="col" className="col-num">
            Campaigns
          </th>
          <th scope="col" className="col-actions">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {channels.map((ch) => (
          <tr key={ch.id}>
            <td className="col-primary">
              <strong>@{ch.username}</strong>
              <div className="admin-muted">{ch.title}</div>
            </td>
            <td className="col-num">{formatNumber(ch.memberCount)}</td>
            <td>
              <span className={`admin-badge admin-badge-bot-${ch.botAccess}`}>{ch.botAccess}</span>
            </td>
            <td>{ch.lastCheckedAt ? formatDateTime(ch.lastCheckedAt) : '—'}</td>
            <td className="col-num">{ch.campaignCount}</td>
            <td className="col-actions">
              <button
                type="button"
                className="admin-btn-text"
                disabled={testing === ch.username}
                onClick={() => onTest(ch.username)}
              >
                {testing === ch.username ? 'Testing…' : 'Test bot'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </AdminTable>
  )
}
