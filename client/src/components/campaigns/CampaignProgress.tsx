import type { Task } from '../../types/task'
import { daysLeft, formatDate, formatMemberCount, formatMoney } from '../../lib/format'
import { categoryLabels, difficultyLabels, isSlotsLow } from '../../lib/task'
import { TaskProgress } from '../tasks/TaskProgress'

interface CampaignProgressProps {
  task: Task
}

export function CampaignProgress({ task }: CampaignProgressProps) {
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
            {task.slotsRemaining}/{task.slotsTotal}
          </dd>
        </div>
        {task.type === 'referral' && task.referralTarget ? (
          <div className="data-row">
            <dt>Milestone</dt>
            <dd>{task.referralTarget} verified subscribers</dd>
          </div>
        ) : null}
      </dl>

      <TaskProgress task={task} />
    </section>
  )
}
