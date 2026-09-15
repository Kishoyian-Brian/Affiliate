export interface ReferralProgress {
  taskId: string
  target: number
  verifiedCount: number
  pendingCount: number
  rejectedCount: number
  referralLink: string
}

export interface ReferralRecord {
  id: string
  taskId: string
  referredDisplayName: string
  status: 'pending' | 'verified' | 'rejected'
  createdAt: string
}
