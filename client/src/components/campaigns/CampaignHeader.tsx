import type { CompletionStatus, Task } from '../../types/task'
import { getCampaignTargetLabel } from '../../lib/affiliate'
import { formatMemberCount } from '../../lib/format'
import { completionStatusLabels, isAffiliateTask, taskTypeLabels } from '../../lib/task'
import { TaskStatusBadge } from '../tasks/TaskStatusBadge'
import { ChannelAvatar } from '../ui/ChannelAvatar'

interface CampaignHeaderProps {
  task: Task
  status: CompletionStatus
}

export function CampaignHeader({ task, status }: CampaignHeaderProps) {
  return (
    <header className="page-header">
      <p className="page-eyebrow">{taskTypeLabels[task.type]}</p>
      <h1>{task.title}</h1>
      <p>
        {getCampaignTargetLabel(task)}
        {isAffiliateTask(task)
          ? ' · Deposit + play'
          : ` · ${formatMemberCount(task.channelMemberCount)}`}
        {' · '}
        {completionStatusLabels[status]}
      </p>
      <div className="task-detail-summary-row" style={{ marginTop: 16 }}>
        <ChannelAvatar name={task.channelTitle} size="md" />
        <div className="task-detail-summary-body">
          <p className="task-detail-channel">{task.channelTitle}</p>
          <p className="task-detail-sponsor">{task.sponsorName}</p>
        </div>
        <TaskStatusBadge status={status} />
      </div>
      <p className="task-detail-description">{task.description}</p>
    </header>
  )
}
