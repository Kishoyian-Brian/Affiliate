import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CampaignForm } from '../components/campaigns/CampaignForm'
import { PageHeader } from '../components/ui/PageHeader'
import { createCampaign } from '../lib/api'
import type { CampaignInput } from '../types'

export function CampaignCreatePage() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(input: CampaignInput) {
    setSaving(true)
    try {
      const campaign = await createCampaign(input)
      navigate(`/admin/campaigns/${campaign.id}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <PageHeader
        title="New campaign"
        description="Create a campaign and publish it to earners when ready."
      />
      <CampaignForm
        saving={saving}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/campaigns')}
      />
    </section>
  )
}
