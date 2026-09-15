import {
  resolveStartButtonUrls,
  startMessageKeyboard,
  TASKLANE_OPEN_BUTTON_TEXT,
  TASKLANE_OPEN_CHANNEL_BUTTON_TEXT,
  TASKLANE_START_MESSAGE,
} from './telegram-welcome';

describe('TASKLANE_START_MESSAGE', () => {
  it('welcomes users to Tasklane, not DLC', () => {
    expect(TASKLANE_START_MESSAGE).toContain('WELCOME TO TASKLANE');
    expect(TASKLANE_START_MESSAGE).toContain('Open Tasklane');
    expect(TASKLANE_START_MESSAGE.toLowerCase()).not.toContain('dlc');
    expect(TASKLANE_START_MESSAGE).not.toMatch(/\bDLC\b/);
  });

  it('uses env URLs for Open Tasklane and Open Channel', () => {
    const urls = resolveStartButtonUrls({
      miniAppUrl: 'https://client-psi-six-83.vercel.app/',
      channelUrl: 'https://t.me/TasklaneSupport',
    });
    const keyboard = startMessageKeyboard(urls.tasklaneUrl, urls.channelUrl);

    expect(urls.tasklaneUrl).toBe('https://client-psi-six-83.vercel.app');
    expect(keyboard.inline_keyboard[0]).toEqual([
      { text: TASKLANE_OPEN_BUTTON_TEXT, url: 'https://client-psi-six-83.vercel.app' },
    ]);
    expect(keyboard.inline_keyboard[1]).toEqual([
      { text: TASKLANE_OPEN_CHANNEL_BUTTON_TEXT, url: 'https://t.me/TasklaneSupport' },
    ]);
  });
});
