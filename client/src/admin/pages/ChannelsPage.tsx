import { useCallback, useEffect, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { AdminTable } from '../components/ui/AdminTable'
import { fetchChannels, testChannelBot } from '../lib/api'
import { formatDateTime, formatNumber } from '../lib/format'
import type { ChannelRecord } from '../types'

export function ChannelsPage() {
  const [channels, setChannels] = useState<ChannelRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setChannels(await fetchChannels())
    setLoading(false)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleTest(username: string) {
    setTesting(username)
    setMessage(null)
    const result = await testChannelBot(username)
    setMessage(result.message)
    setTesting(null)
    await load()
  }

  return (
    <section>
      <PageHeader
        title="Channels"
        description="Channels used in campaigns. Verify bot access before publishing."
      />

      {message ? <p className="admin-banner">{message}</p> : null}

      {loading ? (
        <div className="admin-loading">Loading channels…</div>
      ) : (
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
                  <span className={`admin-badge admin-badge-bot-${ch.botAccess}`}>
                    {ch.botAccess}
                  </span>
                </td>
                <td>{ch.lastCheckedAt ? formatDateTime(ch.lastCheckedAt) : '—'}</td>
                <td className="col-num">{ch.campaignCount}</td>
                <td className="col-actions">
                  <button
                    type="button"
                    className="admin-btn-text"
                    disabled={testing === ch.username}
                    onClick={() => void handleTest(ch.username)}
                  >
                    {testing === ch.username ? 'Testing…' : 'Test bot'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      )}
    </section>
  )
}
