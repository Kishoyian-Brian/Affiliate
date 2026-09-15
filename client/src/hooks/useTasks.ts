import { useCallback, useEffect, useState } from 'react'
import type { Task, TaskCompletion } from '../types/task'
import {
  fetchAllCompletions,
  fetchCompletion,
  fetchTask,
  fetchTasks,
  verifySubscription,
} from '../lib/api'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [completions, setCompletions] = useState<Record<string, TaskCompletion>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const [taskData, completionData] = await Promise.all([fetchTasks(), fetchAllCompletions()])
      setTasks(taskData)
      setCompletions(completionData)
    } catch {
      setError('Could not load tasks.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { tasks, completions, loading, error, reload: load }
}

export function useTaskDetail(taskId: string) {
  const [task, setTask] = useState<Task | null>(null)
  const [completion, setCompletion] = useState<TaskCompletion | null>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)

    try {
      const [taskData, completionData] = await Promise.all([
        fetchTask(taskId),
        fetchCompletion(taskId),
      ])

      setTask(taskData ?? null)
      setCompletion(completionData ?? null)
    } finally {
      setLoading(false)
    }
  }, [taskId])

  useEffect(() => {
    void load()
  }, [load])

  const verify = useCallback(
    async (initData: string) => {
      setVerifying(true)
      setVerifyMessage(null)

      try {
        const result = await verifySubscription(taskId, initData)
        setVerifyMessage(result.message)

        if (result.success) {
          setCompletion({
            taskId,
            status: result.completionStatus,
            rewardStatus: result.rewardStatus,
            verifiedAt: new Date().toISOString(),
            holdReleaseAt: result.holdReleaseAt,
          })
        } else {
          setCompletion({
            taskId,
            status: result.completionStatus,
            rewardStatus: result.rewardStatus,
            failureReason: result.message,
          })
        }

        return result
      } finally {
        setVerifying(false)
      }
    },
    [taskId],
  )

  return {
    task,
    completion,
    loading,
    verifying,
    verifyMessage,
    verify,
    reload: load,
  }
}
