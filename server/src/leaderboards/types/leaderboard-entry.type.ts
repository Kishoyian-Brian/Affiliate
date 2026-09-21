export interface LeaderboardEntry {
  rank: number;
  telegramId: number;
  displayName: string;
  username?: string;
  completedTasks: number;
  totalEarned: number;
  currency: string;
  isCurrentUser?: boolean;
}
