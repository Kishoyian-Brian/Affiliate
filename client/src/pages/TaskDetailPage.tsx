import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ReferralPanel } from '../components/referrals/ReferralPanel'
import { TaskActionPanel } from '../components/tasks/TaskActionPanel'
import { TaskMetaGrid } from '../components/tasks/TaskMetaGrid'
import { TaskRequirements } from '../components/tasks/TaskRequirements'
import { TaskSteps } from '../components/tasks/TaskSteps'
import { ChannelAvatar } from '../components/ui/ChannelAvatar'
import { mockReferralProgress } from '../data/mock'
import { useTelegram } from '../hooks/useTelegram'
import { useTaskDetail } from '../hooks/useTasks'
import { formatMemberCount, formatMoney } from '../lib/format'
import { completionStatusLabels, taskTypeLabels } from '../lib/task'
import { haptic, openTelegramChannel } from '../lib/telegram'

export function TaskDetailPage() {
  const { taskId = '' } = useParams()
  const { initData } = useTelegram()
  const { task, completion, loading, verifying, verifyMessage, verify } = useTaskDetail(taskId)
  const [joined, setJoined] = useState(false)

  const status = completion?.status ?? 'not_started'
  const referralProgress = mockReferralProgress[taskId]

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

  function handleJoin() {
    if (!task) return
    haptic('light')
    openTelegramChannel(task.channelUsername)
    setJoined(true)
  }

  function handleVerify() {
    void verify(initData)
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
      <header className="page-header">
        <p className="page-eyebrow">{taskTypeLabels[task.type]}</p>
        <h1>{task.title}</h1>
        <p>
          @{task.channelUsername} · {formatMemberCount(task.channelMemberCount)} ·{' '}
          {completionStatusLabels[status]}
        </p>
      </header>

      <section className="section-card task-detail-summary">
        <div className="task-detail-summary-row">
          <ChannelAvatar name={task.channelTitle} size="md" />
          <div className="task-detail-summary-body">
            <p className="task-detail-channel">{task.channelTitle}</p>
            <p className="task-detail-sponsor">{task.sponsorName}</p>
          </div>
          <div className="task-detail-reward">
            <span>{formatMoney(task.rewardAmount, task.rewardCurrency)}</span>
            <small>{task.rewardLabel}</small>
          </div>
        </div>
        <p className="task-detail-description">{task.description}</p>
      </section>

      <TaskActionPanel
        task={task}
        completion={completion}
        joined={joined}
        verifying={verifying}
        verifyMessage={verifyMessage}
        onJoin={handleJoin}
        onVerify={() => void handleVerify()}
      />

      <TaskMetaGrid task={task} />

      <section className="section-card">
        <header className="section-header">
          <h2>Completion steps</h2>
        </header>
        <TaskSteps steps={steps} />
      </section>

      <TaskRequirements task={task} />

      {task.type === 'referral' && referralProgress ? (
        <ReferralPanel progress={referralProgress} taskTitle={task.channelTitle} />
      ) : null}
    </section>
  )
}
