import type { Task } from '../../types/task'
import { formatMoney } from '../../lib/format'
import { isAffiliateTask } from '../../lib/task'

interface TaskRequirementProps {
  task: Task
}

export function TaskRequirement({ task }: TaskRequirementProps) {
  const { requirements } = task
  const affiliate = isAffiliateTask(task)

  return (
    <section className="section-card">
      <header className="section-header">
        <h2>Requirements</h2>
      </header>

      <ul className="task-requirements-list">
        <li>
          <strong>Verification</strong>
          <span>
            {affiliate
              ? 'Trading app confirms deposit and play'
              : 'Telegram Bot API membership check'}
          </span>
        </li>
        <li>
          <strong>{affiliate ? 'Qualification' : 'Hold period'}</strong>
          <span>
            {affiliate
              ? 'Referred friend deposits and actually plays'
              : requirements.mustStaySubscribed
                ? `${requirements.holdHours} hours after verification`
                : 'None'}
          </span>
        </li>
        <li>
          <strong>Eligibility</strong>
          <span>
            {affiliate
              ? 'New referred players only'
              : requirements.newMembersOnly
                ? 'New subscribers only'
                : 'All subscribers'}
          </span>
        </li>
        {requirements.minAccountAgeDays ? (
          <li>
            <strong>Account age</strong>
            <span>Minimum {requirements.minAccountAgeDays} days</span>
          </li>
        ) : null}
        <li>
          <strong>Limit</strong>
          <span>
            {affiliate
              ? `${formatMoney(task.rewardAmount, task.rewardCurrency)} per qualified friend`
              : `${requirements.maxCompletionsPerUser} completion per account`}
          </span>
        </li>
      </ul>

      <div className="task-rules">
        <h4>Rules</h4>
        <ul>
          {task.rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
