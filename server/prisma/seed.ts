import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function upsertChannel(input: {
  username: string;
  title: string;
  memberCount: number;
}) {
  return prisma.channel.upsert({
    where: { username: input.username },
    update: {
      title: input.title,
      memberCount: input.memberCount,
      botAccess: 'ok',
    },
    create: {
      username: input.username,
      title: input.title,
      memberCount: input.memberCount,
      botAccess: 'ok',
    },
  });
}

async function upsertCampaign(input: {
  channelId: string;
  title: string;
  shortDescription: string;
  description: string;
  type: 'subscribe' | 'referral' | 'affiliate';
  sponsorName: string;
  rewardAmount: number;
  holdHours: number;
  slotsTotal: number;
  referralTarget?: number;
  affiliateUrl?: string;
  requirements: Record<string, unknown>;
  rules: string[];
  status: 'active' | 'draft' | 'paused' | 'ended';
  startAt: string;
  endAt: string;
}) {
  const existing = await prisma.campaign.findFirst({
    where: { title: input.title, channelId: input.channelId },
  });

  const data = {
    channelId: input.channelId,
    title: input.title,
    shortDescription: input.shortDescription,
    description: input.description,
    type: input.type,
    sponsorName: input.sponsorName,
    rewardAmount: input.rewardAmount,
    rewardCurrency: 'USD',
    holdHours: input.holdHours,
    slotsTotal: input.slotsTotal,
    referralTarget: input.referralTarget,
    affiliateUrl: input.affiliateUrl,
    requirements: input.requirements as Prisma.InputJsonValue,
    rules: input.rules,
    status: input.status,
    startAt: new Date(input.startAt),
    endAt: new Date(input.endAt),
  };

  if (existing) {
    return prisma.campaign.update({ where: { id: existing.id }, data });
  }

  return prisma.campaign.create({ data });
}

async function main() {
  const cryptoDaily = await upsertChannel({
    username: 'cryptodaily',
    title: 'Crypto Daily',
    memberCount: 84200,
  });
  const techHub = await upsertChannel({
    username: 'techhub',
    title: 'Tech Hub',
    memberCount: 31500,
  });
  const alphaSignals = await upsertChannel({
    username: 'alphasignals',
    title: 'Alpha Signals',
    memberCount: 12800,
  });
  const defiWire = await upsertChannel({
    username: 'defiwire',
    title: 'DeFi Wire',
    memberCount: 45600,
  });
  const aiAutoTrade = await upsertChannel({
    username: 'aiautotrade',
    title: 'AI AutoTrade',
    memberCount: 0,
  });

  await upsertCampaign({
    channelId: cryptoDaily.id,
    title: 'Subscribe to Crypto Daily',
    shortDescription: 'Join the channel, verify membership, earn $1 after 48h hold.',
    description:
      'Crypto Daily shares daily market breakdowns, altcoin watchlists, and on-chain alerts. Subscribe to the official channel, pass bot verification, and keep your membership active through the hold window to unlock the reward.',
    type: 'subscribe',
    sponsorName: 'Crypto Daily Media',
    rewardAmount: 1,
    holdHours: 48,
    slotsTotal: 500,
    requirements: {
      mustStaySubscribed: true,
      holdHours: 48,
      newMembersOnly: false,
      minAccountAgeDays: 7,
      maxCompletionsPerUser: 1,
      category: 'crypto',
      difficulty: 'easy',
      estimatedMinutes: 3,
      tags: ['Verified', '48h hold', 'Crypto'],
      channelDescription: 'Daily crypto news, charts, and market-moving alerts.',
      rewardLabel: 'Fixed payout',
    },
    rules: [
      'You must join @cryptodaily before pressing Verify.',
      'Telegram Bot API must return member, administrator, or creator status.',
      'Reward is cancelled if you leave the channel before the 48-hour hold ends.',
      'One completion per Telegram account.',
    ],
    status: 'active',
    startAt: '2026-09-10T00:00:00Z',
    endAt: '2026-12-31T23:59:59Z',
  });

  await upsertCampaign({
    channelId: techHub.id,
    title: 'Refer 10 subscribers to Tech Hub',
    shortDescription: 'Share your link. Earn $5 when 10 friends verify their subscription.',
    description:
      'Help Tech Hub grow with real, verified subscribers. Share your personal referral link inside Telegram. Each friend must join @techhub and pass independent bot verification before they count toward your milestone.',
    type: 'referral',
    sponsorName: 'Tech Hub Growth',
    rewardAmount: 5,
    holdHours: 48,
    slotsTotal: 200,
    referralTarget: 10,
    requirements: {
      mustStaySubscribed: true,
      holdHours: 48,
      newMembersOnly: true,
      minAccountAgeDays: 14,
      maxCompletionsPerUser: 1,
      category: 'tech',
      difficulty: 'medium',
      estimatedMinutes: 15,
      tags: ['Referral', 'Milestone', 'Tech'],
      channelDescription: 'Startup news, builder tools, and weekly product drops.',
      rewardLabel: 'Milestone bonus',
    },
    rules: [
      'Referrals count only after the referred user verifies independently.',
      'Self-referrals and duplicate accounts are rejected automatically.',
      'Referred users must remain subscribed through their own hold period.',
      'Milestone reward unlocks when verified count reaches 10.',
    ],
    status: 'active',
    startAt: '2026-09-10T00:00:00Z',
    endAt: '2026-12-31T23:59:59Z',
  });

  await upsertCampaign({
    channelId: alphaSignals.id,
    title: 'Subscribe to Alpha Signals',
    shortDescription: 'Premium trading signals channel — $0.75 after 24h verified hold.',
    description:
      'Alpha Signals publishes short-form trade setups and risk notes for active traders. Subscribe, verify once, and remain in the channel for 24 hours to receive your payout.',
    type: 'subscribe',
    sponsorName: 'Alpha Desk',
    rewardAmount: 0.75,
    holdHours: 24,
    slotsTotal: 1000,
    requirements: {
      mustStaySubscribed: true,
      holdHours: 24,
      newMembersOnly: true,
      maxCompletionsPerUser: 1,
      category: 'trading',
      difficulty: 'easy',
      estimatedMinutes: 2,
      tags: ['Trading', '24h hold', 'New members'],
      channelDescription: 'Trade setups, entries, and risk management updates.',
      rewardLabel: 'Fixed payout',
    },
    rules: [
      'Only new subscribers to @alphasignals are eligible.',
      'Verification uses Telegram membership status via bot API.',
      'Leaving before 24 hours cancels the pending reward.',
    ],
    status: 'active',
    startAt: '2026-09-01T00:00:00Z',
    endAt: '2026-12-31T23:59:59Z',
  });

  await upsertCampaign({
    channelId: defiWire.id,
    title: 'Subscribe to DeFi Wire',
    shortDescription: 'DeFi news channel — $1.25 payout, limited spots remaining.',
    description:
      'DeFi Wire covers protocol launches, airdrop alerts, and yield opportunities. Complete a verified subscription task before campaign slots run out.',
    type: 'subscribe',
    sponsorName: 'DeFi Wire Team',
    rewardAmount: 1.25,
    holdHours: 72,
    slotsTotal: 300,
    requirements: {
      mustStaySubscribed: true,
      holdHours: 72,
      newMembersOnly: false,
      minAccountAgeDays: 30,
      maxCompletionsPerUser: 1,
      category: 'news',
      difficulty: 'easy',
      estimatedMinutes: 3,
      tags: ['DeFi', 'Limited', '72h hold'],
      channelDescription: 'DeFi news, launches, and ecosystem updates.',
      rewardLabel: 'Fixed payout',
    },
    rules: [
      'Account must be at least 30 days old.',
      '72-hour hold applies after successful verification.',
      'Limited campaign — reward available while slots last.',
    ],
    status: 'active',
    startAt: '2026-09-12T00:00:00Z',
    endAt: '2026-12-31T23:59:59Z',
  });

  await upsertCampaign({
    channelId: aiAutoTrade.id,
    title: 'Affiliate AI AutoTrade',
    shortDescription: 'Invite friends. Earn $40 when a friend deposits and plays.',
    description:
      'Invite friends to AI AutoTrade from Telegram. You earn $40 for each referred friend who deposits and actually plays. Signing up yourself does not pay the bonus — only a qualified referred player does.',
    type: 'affiliate',
    sponsorName: 'AI AutoTrade',
    rewardAmount: 40,
    holdHours: 0,
    slotsTotal: 1000,
    affiliateUrl: 'https://aiautotrade.trade',
    requirements: {
      mustStaySubscribed: false,
      holdHours: 0,
      newMembersOnly: true,
      maxCompletionsPerUser: 99,
      category: 'trading',
      difficulty: 'medium',
      estimatedMinutes: 5,
      tags: ['Affiliate', 'Trading', '$40'],
      channelDescription: 'AI-assisted trading platform. Deposit and play to qualify referrals.',
      rewardLabel: 'Per qualified player',
    },
    rules: [
      'Tap Launch and confirm so the trading app opens inside Telegram.',
      'Invite friends from Telegram — do not share a website URL.',
      '$40 is paid only after a referred friend deposits and actually plays.',
      'Self-referrals and duplicate accounts do not qualify.',
      'Payout posts when the trading app confirms deposit and play.',
    ],
    status: 'active',
    startAt: '2026-09-15T00:00:00Z',
    endAt: '2026-12-31T23:59:59Z',
  });

  const count = await prisma.campaign.count({ where: { status: 'active' } });
  console.log(`Seeded campaigns. Active campaigns: ${count}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
