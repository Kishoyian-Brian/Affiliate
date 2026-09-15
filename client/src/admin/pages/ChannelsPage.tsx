import { useCallback, useEffect, useState } from 'react'
import { ChannelTable } from '../components/channels/ChannelTable'
import { PageHeader } from '../components/ui/PageHeader'
import { useToast } from '../../hooks/useToast'
import { fetchChannels, testChannelBot } from '../lib/api'
import type { ChannelRecord } from '../types'

export function ChannelsPage() {
  const { toast } = useToast()
  const [channels, setChannels] = useState<ChannelRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState<string | null>(null)

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
    const result = await testChannelBot(username)
    toast(result.message, result.ok ? 'success' : 'error')
    setTesting(null)
    await load()
  }

  return (
    <section>
      <PageHeader
        title="Channels"
        description="Channels used in campaigns. Verify bot access before publishing."
      />

      {loading ? (
        <div className="admin-loading">Loading channels…</div>
      ) : (
        <ChannelTable channels={channels} testing={testing} onTest={(username) => void handleTest(username)} />
      )}
    </section>
  )
}
