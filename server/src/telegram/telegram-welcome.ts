export const TASKLANE_START_MESSAGE = [
  'WELCOME TO TASKLANE',
  '',
  'PHASE 01 · 5,000,000 TON USER REWARD BUDGET',
  '',
  'Complete verified channel tasks and check in to collect Tasklane points. Finish a task for 200 Tasklane points to discover TON rewards or more points.',
  '',
  'Invite rewards: 200 Tasklane points for regular users; 400 Tasklane points for VIP users. Track credited rewards in your account.',
  '',
  'Withdrawal route: share to 3 groups → invite 20 friends → submit an application with sufficient balance. Range: 200–10,000 TON. No withdrawal fee; manual review applies.',
  '',
  'Optional skips: group sharing 1 TON; invitations 5 TON. Skips do not add balance or guarantee approval.',
  '',
  'Open Tasklane to see your tasks, progress and campaign rules.',
].join('\n');

export const TASKLANE_OPEN_BUTTON_TEXT = 'Open Tasklane';
export const TASKLANE_OPEN_CHANNEL_BUTTON_TEXT = 'Open Channel';

export function normalizeHttpUrl(url: string) {
  return url.trim().replace(/\/+$/, '');
}

export function resolveStartButtonUrls(input: {
  miniAppUrl?: string;
  channelUrl?: string;
  channelUsername?: string;
  botUsername?: string;
}) {
  const botUsername = (input.botUsername ?? 'tasklane_bot').replace(/^@/, '');
  const channelUsername = (input.channelUsername ?? 'TasklaneSupport').replace(/^@/, '');

  return {
    tasklaneUrl: normalizeHttpUrl(
      input.miniAppUrl || `https://t.me/${botUsername}?startapp`,
    ),
    channelUrl: normalizeHttpUrl(input.channelUrl || `https://t.me/${channelUsername}`),
  };
}

export function startMessageKeyboard(tasklaneUrl: string, channelUrl: string) {
  return {
    inline_keyboard: [
      [{ text: TASKLANE_OPEN_BUTTON_TEXT, url: tasklaneUrl }],
      [{ text: TASKLANE_OPEN_CHANNEL_BUTTON_TEXT, url: channelUrl }],
    ],
  };
}

