import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CampaignHeader } from '../components/campaigns/CampaignHeader'
import { CampaignProgress } from '../components/campaigns/CampaignProgress'
import { CampaignRewardPreview } from '../components/campaigns/CampaignRewardPreview'
import { ReferralHistory } from '../components/referrals/ReferralHistory'
import { ReferralLinkCard } from '../components/referrals/ReferralLinkCard'
import { ReferralStats } from '../components/referrals/ReferralStats'
import { TaskRequirement } from '../components/tasks/TaskRequirement'
import { TaskSteps } from '../components/tasks/TaskSteps'
import { TaskVerification } from '../components/tasks/TaskVerification'
import { useAuth } from '../hooks/useAuth'
import { useReferrals } from '../hooks/useReferrals'
import { useTaskDetail } from '../hooks/useTasks'
import { haptic, openTelegramChannel } from '../lib/telegram'
import { useToast } from '../hooks/useToast'

export function TaskDetailPage() {
  const { taskId = '' } = useParams()
  const { initData } = useAuth()
  const { toast } = useToast()
  const { task, completion, loading, verifying, verifyMessage, verify } = useTaskDetail(taskId)
  const { progress, history } = useReferrals(task?.type === 'referral' ? taskId : undefined)
  const [joined, setJoined] = useState(false)

  const status = completion?.status ?? 'not_started'

  const steps = useMemo(() => {
    if (!task) return []

    const base = [
      {
        id: 1,
        label: `Join @${task.channelUsername} in Telegram`,
        done: joined || status !== 'not_started',
      },
      {
        id: 2,
        label: 'Verify your subscription',
        done: ['verified_pending', 'completed'].includes(status),
      },
      {
        id: 3,
        label: `Remain subscribed for ${task.holdHours} hours`,
        done: status === 'completed',
      },
    ]

    if (task.type === 'referral') {
      return [
        ...base,
        {
          id: 4,
          label: `Refer ${task.referralTarget ?? 0} verified subscribers`,
          done: status === 'completed',
        },
        {
          id: 5,
          label: 'Reward released to wallet',
          done: completion?.rewardStatus === 'released',
        },
      ]
    }

    return [
      ...base,
      {
        id: 4,
        label: 'Reward released to wallet',
        done: completion?.rewardStatus === 'released',
      },
    ]
  }, [task, joined, status, completion?.rewardStatus])

  useEffect(() => {
    if (task) {
      document.title = `Tasklane — ${task.title}`
    }
  }, [task])

  useEffect(() => {
    if (status !== 'not_started') {
      setJoined(true)
    }
  }, [status])

  async function handleVerify() {
    const result = await verify(initData)
    if (!result) return
    toast(result.message, result.success ? 'success' : 'error')
  }

  function handleJoin() {
    if (!task) return
    haptic('light')
    openTelegramChannel(task.channelUsername)
    setJoined(true)
  }

  if (loading) {
    return <div className="state-block">Loading campaign…</div>
  }

  if (!task) {
    return (
      <section className="page">
        <div className="state-block">
          <h2>Campaign not found</h2>
          <p>This campaign may have ended or the link is invalid.</p>
          <Link to="/app" className="btn btn-secondary">
            Back to campaigns
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="page task-detail">
      <CampaignHeader task={task} status={status} />
      <CampaignRewardPreview task={task} />

      <TaskVerification
        task={task}
        completion={completion}
        joined={joined}
        verifying={verifying}
        verifyMessage={verifyMessage}
        onJoin={handleJoin}
        onVerify={() => void handleVerify()}
      />

      <CampaignProgress task={task} />

      <section className="section-card">
        <header className="section-header">
          <h2>Completion steps</h2>
        </header>
        <TaskSteps steps={steps} />
      </section>

      <TaskRequirement task={task} />

      {task.type === 'referral' && progress ? (
        <section className="section-card referral-panel">
          <header className="section-header">
            <h2>Referral progress</h2>
            <p>Only independently verified subscribers count.</p>
          </header>
          <ReferralStats progress={progress} />
          <ReferralLinkCard referralLink={progress.referralLink} taskTitle={task.channelTitle} />
          <ReferralHistory records={history} />
        </section>
      ) : null}
    </section>
  )
}
