import type { Task } from '../../types/task'
import { formatMoney } from '../../lib/format'

export function CampaignRewardPreview({ task }: { task: Task }) {
  return (
    <section className="section-card task-detail-summary">
      <div className="task-detail-reward" style={{ textAlign: 'left' }}>
        <span>{formatMoney(task.rewardAmount, task.rewardCurrency)}</span>
        <small>{task.rewardLabel}</small>
      </div>
      <p className="helper-text">
        Paid after Telegram verifies membership
        {task.holdHours ? ` and a ${task.holdHours}-hour hold` : ''}.
      </p>
    </section>
  )
}
