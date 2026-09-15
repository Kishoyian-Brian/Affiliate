export interface CampaignRequirements {
  mustStaySubscribed: boolean;
  holdHours: number;
  newMembersOnly: boolean;
  minAccountAgeDays?: number;
  maxCompletionsPerUser: number;
}
