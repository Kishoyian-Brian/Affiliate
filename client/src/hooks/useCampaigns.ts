import { useCallback, useEffect, useState } from 'react'
import { fetchTasks } from '../lib/api'
import { getErrorMessage } from '../lib/errors'
import type { Campaign } from '../types/campaign'

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setCampaigns(await fetchTasks())
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load campaigns.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { campaigns, loading, error, reload: load }
}
