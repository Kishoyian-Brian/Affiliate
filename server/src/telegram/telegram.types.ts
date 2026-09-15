export const ACCEPTED_MEMBER_STATUSES = [
  'creator',
  'administrator',
  'member',
] as const;

export type AcceptedMemberStatus = (typeof ACCEPTED_MEMBER_STATUSES)[number];

export interface TelegramChatMember {
  status: string;
  isMember: boolean;
}

export interface TelegramChatInfo {
  id: bigint;
  title: string;
  username?: string;
  memberCount?: number;
}
