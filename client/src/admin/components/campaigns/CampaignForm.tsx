import { useState, type FormEvent } from 'react'
import type { AdminCampaign, CampaignInput } from '../../types'

const emptyForm: CampaignInput = {
  title: '',
  shortDescription: '',
  description: '',
  type: 'subscribe',
  channelUsername: '',
  channelTitle: '',
  channelMemberCount: 0,
  sponsorName: 'Tasklane',
  rewardAmount: 1,
  rewardCurrency: 'USD',
  holdHours: 48,
  slotsTotal: 100,
  requirements: {
    mustStaySubscribed: true,
    holdHours: 48,
    newMembersOnly: false,
    maxCompletionsPerUser: 1,
  },
  rules: ['Join the channel before pressing Verify.', 'Stay subscribed through the hold period.'],
  status: 'draft',
  startAt: new Date().toISOString().slice(0, 10),
  endAt: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
}

interface CampaignFormProps {
  initial?: AdminCampaign
  saving: boolean
  onSubmit: (input: CampaignInput) => Promise<void>
  onCancel: () => void
}

export function CampaignForm({ initial, saving, onSubmit, onCancel }: CampaignFormProps) {
  const [form, setForm] = useState<CampaignInput>(() =>
    initial
      ? {
          title: initial.title,
          shortDescription: initial.shortDescription,
          description: initial.description,
          type: initial.type,
          channelUsername: initial.channelUsername,
          channelTitle: initial.channelTitle,
          channelMemberCount: initial.channelMemberCount,
          sponsorName: initial.sponsorName,
          rewardAmount: initial.rewardAmount,
          rewardCurrency: initial.rewardCurrency,
          referralTarget: initial.referralTarget,
          holdHours: initial.holdHours,
          slotsTotal: initial.slotsTotal,
          requirements: { ...initial.requirements },
          rules: [...initial.rules],
          status: initial.status,
          startAt: initial.startAt.slice(0, 10),
          endAt: initial.endAt.slice(0, 10),
        }
      : emptyForm,
  )

  const [rulesText, setRulesText] = useState(form.rules.join('\n'))

  function update<K extends keyof CampaignInput>(key: K, value: CampaignInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const input: CampaignInput = {
      ...form,
      channelUsername: form.channelUsername.replace('@', '').trim(),
      rules: rulesText.split('\n').map((r) => r.trim()).filter(Boolean),
      requirements: { ...form.requirements, holdHours: form.holdHours },
      startAt: new Date(form.startAt).toISOString(),
      endAt: new Date(form.endAt + 'T23:59:59').toISOString(),
    }
    await onSubmit(input)
  }

  return (
    <form className="admin-form" onSubmit={(e) => void handleSubmit(e)}>
      <section className="admin-form-section">
        <h2>Campaign</h2>
        <div className="admin-form-grid">
          <label className="admin-field admin-field-full">
            <span>Title</span>
            <input
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
            />
          </label>
          <label className="admin-field admin-field-full">
            <span>Short description</span>
            <input
              required
              value={form.shortDescription}
              onChange={(e) => update('shortDescription', e.target.value)}
            />
          </label>
          <label className="admin-field admin-field-full">
            <span>Full description</span>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Type</span>
            <select value={form.type} onChange={(e) => update('type', e.target.value as CampaignInput['type'])}>
              <option value="subscribe">Subscribe</option>
              <option value="referral">Referral</option>
            </select>
          </label>
          <label className="admin-field">
            <span>Status</span>
            <select
              value={form.status}
              onChange={(e) => update('status', e.target.value as CampaignInput['status'])}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="ended">Ended</option>
            </select>
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <h2>Target channel</h2>
        <p className="admin-form-note">
          You add every campaign manually. Ensure the bot is admin on this channel before publishing.
        </p>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Channel username</span>
            <input
              required
              placeholder="cryptodaily"
              value={form.channelUsername}
              onChange={(e) => update('channelUsername', e.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Channel title</span>
            <input
              required
              value={form.channelTitle}
              onChange={(e) => update('channelTitle', e.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>Member count</span>
            <input
              type="number"
              min={0}
              value={form.channelMemberCount || ''}
              onChange={(e) => update('channelMemberCount', Number(e.target.value) || 0)}
            />
          </label>
          <label className="admin-field">
            <span>Sponsor label</span>
            <input value={form.sponsorName} onChange={(e) => update('sponsorName', e.target.value)} />
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <h2>Reward & limits</h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Reward amount</span>
            <input
              type="number"
              min={0}
              step="0.01"
              required
              value={form.rewardAmount}
              onChange={(e) => update('rewardAmount', Number(e.target.value))}
            />
          </label>
          <label className="admin-field">
            <span>Currency</span>
            <input value={form.rewardCurrency} onChange={(e) => update('rewardCurrency', e.target.value)} />
          </label>
          <label className="admin-field">
            <span>Hold period (hours)</span>
            <input
              type="number"
              min={1}
              value={form.holdHours}
              onChange={(e) => update('holdHours', Number(e.target.value))}
            />
          </label>
          <label className="admin-field">
            <span>Total spots</span>
            <input
              type="number"
              min={1}
              value={form.slotsTotal}
              onChange={(e) => update('slotsTotal', Number(e.target.value))}
            />
          </label>
          {form.type === 'referral' ? (
            <label className="admin-field">
              <span>Referral target</span>
              <input
                type="number"
                min={1}
                value={form.referralTarget ?? 10}
                onChange={(e) => update('referralTarget', Number(e.target.value))}
              />
            </label>
          ) : null}
        </div>
      </section>

      <section className="admin-form-section">
        <h2>Requirements</h2>
        <div className="admin-form-grid">
          <label className="admin-field admin-checkbox">
            <input
              type="checkbox"
              checked={form.requirements.newMembersOnly}
              onChange={(e) =>
                update('requirements', { ...form.requirements, newMembersOnly: e.target.checked })
              }
            />
            <span>New subscribers only</span>
          </label>
          <label className="admin-field">
            <span>Min account age (days)</span>
            <input
              type="number"
              min={0}
              value={form.requirements.minAccountAgeDays ?? ''}
              onChange={(e) =>
                update('requirements', {
                  ...form.requirements,
                  minAccountAgeDays: e.target.value ? Number(e.target.value) : undefined,
                })
              }
            />
          </label>
          <label className="admin-field admin-field-full">
            <span>Rules (one per line)</span>
            <textarea rows={4} value={rulesText} onChange={(e) => setRulesText(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="admin-form-section">
        <h2>Schedule</h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Start date</span>
            <input
              type="date"
              required
              value={form.startAt}
              onChange={(e) => update('startAt', e.target.value)}
            />
          </label>
          <label className="admin-field">
            <span>End date</span>
            <input
              type="date"
              required
              value={form.endAt}
              onChange={(e) => update('endAt', e.target.value)}
            />
          </label>
        </div>
      </section>

      <div className="admin-form-actions">
        <button type="button" className="admin-btn admin-btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
          {saving ? 'Saving…' : initial ? 'Save changes' : 'Create campaign'}
        </button>
      </div>
    </form>
  )
}
