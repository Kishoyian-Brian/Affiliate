import type {
  CompletionStatus,
  Task,
  TaskCategory,
  TaskCompletion,
  TaskDifficulty,
  TaskType,
} from '../types/task'

export const completionStatusLabels: Record<CompletionStatus, string> = {
  not_started: 'Not started',
  awaiting_verification: 'Awaiting verification',
  verifying: 'Verifying',
  verified_pending: 'On hold',
  completed: 'Completed',
  failed: 'Verification failed',
  cancelled: 'Cancelled',
}

export const categoryLabels: Record<TaskCategory, string> = {
  crypto: 'Crypto',
  tech: 'Tech',
  trading: 'Trading',
  news: 'News',
  community: 'Community',
}

export const difficultyLabels: Record<TaskDifficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

export const taskTypeLabels: Record<TaskType, string> = {
  subscribe: 'Subscribe',
  referral: 'Referral',
}

export function getCompletionStatus(completion?: TaskCompletion) {
  return completion?.status ?? 'not_started'
}

export function isSlotsLow(task: Task) {
  return task.slotsTotal > 0 && task.slotsRemaining / task.slotsTotal <= 0.15
}

export function canShowVerify(status: string, joined: boolean) {
  return joined || status === 'awaiting_verification' || status === 'failed'
}

export function canShowJoin(status: string, joined: boolean) {
  return status === 'not_started' && !joined
}

export function isTerminalStatus(status: string) {
  return status === 'verified_pending' || status === 'completed' || status === 'cancelled'
}
