import { Prisma } from '@prisma/client';

export interface CampaignRequirements {
  mustStaySubscribed: boolean;
  holdHours: number;
  newMembersOnly: boolean;
  minAccountAgeDays?: number;
  maxCompletionsPerUser: number;
}

export const defaultCampaignRequirements: CampaignRequirements = {
  mustStaySubscribed: true,
  holdHours: 48,
  newMembersOnly: false,
  maxCompletionsPerUser: 1,
};

export function asCampaignRequirements(
  value: Prisma.JsonValue,
): CampaignRequirements {
  const raw = (value ?? {}) as Partial<CampaignRequirements>;
  return {
    mustStaySubscribed: raw.mustStaySubscribed ?? true,
    holdHours: raw.holdHours ?? 48,
    newMembersOnly: raw.newMembersOnly ?? false,
    minAccountAgeDays: raw.minAccountAgeDays,
    maxCompletionsPerUser: raw.maxCompletionsPerUser ?? 1,
  };
}
