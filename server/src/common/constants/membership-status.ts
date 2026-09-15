export enum MembershipStatus {
  Creator = 'creator',
  Administrator = 'administrator',
  Member = 'member',
  Restricted = 'restricted',
  Left = 'left',
  Kicked = 'kicked',
}

export const ACCEPTED_MEMBERSHIP_STATUSES = [
  MembershipStatus.Creator,
  MembershipStatus.Administrator,
  MembershipStatus.Member,
] as const;
