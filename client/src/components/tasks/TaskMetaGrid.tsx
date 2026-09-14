import type { Task } from '../../types'
import { daysLeft, formatDate, formatMemberCount, formatMoney, formatSlotsRemaining } from '../../lib/format'
import { categoryLabels, difficultyLabels, isSlotsLow } from '../../lib/task'

interface TaskMetaGridProps {
  task: Task
}

export function TaskMetaGrid({ task }: TaskMetaGridProps) {
  const slotsPct = task.slotsTotal > 0 ? (task.slotsRemaining / task.slotsTotal) * 100 : 0
  const slotsLow = isSlotsLow(task)

  return (
    <section className="section-card">
      <header className="section-header">
        <h2>Campaign details</h2>
      </header>

      <dl className="data-table">
        <div className="data-row">
          <dt>Reward</dt>
          <dd>{formatMoney(task.rewardAmount, task.rewardCurrency)}</dd>
        </div>
        <div className="data-row">
          <dt>Type</dt>
          <dd>{categoryLabels[task.category]}</dd>
        </div>
        <div className="data-row">
          <dt>Hold period</dt>
          <dd>{task.holdHours} hours</dd>
        </div>
        <div className="data-row">
          <dt>Est. time</dt>
          <dd>{task.estimatedMinutes} minutes</dd>
        </div>
        <div className="data-row">
          <dt>Difficulty</dt>
          <dd>{difficultyLabels[task.difficulty]}</dd>
        </div>
        <div className="data-row">
          <dt>Channel</dt>
          <dd>
            @{task.channelUsername} · {formatMemberCount(task.channelMemberCount)}
          </dd>
        </div>
        <div className="data-row">
          <dt>Deadline</dt>
          <dd>
            {daysLeft(task.endAt)} days · {formatDate(task.endAt)}
          </dd>
        </div>
        <div className="data-row">
          <dt>Spots</dt>
          <dd className={slotsLow ? 'data-row-alert' : undefined}>
            {formatSlotsRemaining(task.slotsRemaining, task.slotsTotal)}
          </dd>
        </div>
        {task.type === 'referral' && task.referralTarget ? (
          <div className="data-row">
            <dt>Milestone</dt>
            <dd>{task.referralTarget} verified subscribers</dd>
          </div>
        ) : null}
      </dl>

      <div className={`task-slots ${slotsLow ? 'task-slots-low' : ''}`}>
        <div className="task-slots-top">
          <span>Capacity remaining</span>
          <strong>{Math.round(slotsPct)}%</strong>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${slotsPct}%` }} />
        </div>
      </div>
    </section>
  )
}
