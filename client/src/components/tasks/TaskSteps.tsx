interface Step {
  id: number
  label: string
  done: boolean
}

interface TaskStepsProps {
  steps: Step[]
}

export function TaskSteps({ steps }: TaskStepsProps) {
  return (
    <ol className="task-steps">
      {steps.map((step) => (
        <li key={step.id} className={step.done ? 'done' : ''}>
          <span className="task-step-num">{step.id}</span>
          <span className="task-step-label">{step.label}</span>
        </li>
      ))}
    </ol>
  )
}
