import type { Task } from '../../types/task'

interface TaskRequirementProps {
  task: Task
}

export function TaskRequirement({ task }: TaskRequirementProps) {
  const { requirements } = task

  return (
    <section className="section-card">
      <header className="section-header">
        <h2>Requirements</h2>
      </header>

      <ul className="task-requirements-list">
        <li>
          <strong>Verification</strong>
          <span>Telegram Bot API membership check</span>
        </li>
        <li>
          <strong>Hold period</strong>
          <span>
            {requirements.mustStaySubscribed
              ? `${requirements.holdHours} hours after verification`
              : 'None'}
          </span>
        </li>
        <li>
          <strong>Eligibility</strong>
          <span>{requirements.newMembersOnly ? 'New subscribers only' : 'All subscribers'}</span>
        </li>
        {requirements.minAccountAgeDays ? (
          <li>
            <strong>Account age</strong>
            <span>Minimum {requirements.minAccountAgeDays} days</span>
          </li>
        ) : null}
        <li>
          <strong>Limit</strong>
          <span>{requirements.maxCompletionsPerUser} completion per account</span>
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
