import { Link } from 'react-router-dom'
import type { Task, TaskCompletion } from '../../types/task'
import { getCampaignTargetLabel } from '../../lib/affiliate'
import { daysLeft, formatMemberCount, formatMoney } from '../../lib/format'
import {
  completionStatusLabels,
  getCompletionStatus,
  isAffiliateTask,
  isSlotsLow,
  taskTypeLabels,
} from '../../lib/task'
import { ChannelAvatar } from '../ui/ChannelAvatar'

interface TaskCardProps {
  task: Task
  completion?: TaskCompletion
}

export function TaskCard({ task, completion }: TaskCardProps) {
  const status = getCompletionStatus(completion)
  const slotsLow = isSlotsLow(task)
  const ended = task.status === 'ended' || daysLeft(task.endAt) === 0

  return (
    <Link
      to={`/app/tasks/${task.id}`}
      className={`task-row ${ended ? 'task-row-ended' : ''}`}
    >
      <ChannelAvatar name={task.channelTitle} />
      <div className="task-row-content">
        <div className="task-row-primary">
          <h3>{task.title}</h3>
          <span className="task-row-amount">
            {formatMoney(task.rewardAmount, task.rewardCurrency)}
          </span>
        </div>
        <p className="task-row-secondary">
          {getCampaignTargetLabel(task)}
          {isAffiliateTask(task) ? '' : ` · ${formatMemberCount(task.channelMemberCount)}`}
          {' · '}
          {taskTypeLabels[task.type]}
        </p>
        <p className="task-row-tertiary">
          {completionStatusLabels[status]}
          {slotsLow ? ' · Limited spots' : ''}
          {ended ? ' · Ended' : ''}
          {' · '}
          {isAffiliateTask(task)
            ? `${formatMoney(task.rewardAmount, task.rewardCurrency)} per qualified player · ${task.slotsRemaining} spots · ${daysLeft(task.endAt)}d left`
            : `${task.holdHours}h hold · ${task.slotsRemaining} spots · ${daysLeft(task.endAt)}d left`}
        </p>
      </div>
      <svg
        className="task-row-chevron"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Link>
  )
}
