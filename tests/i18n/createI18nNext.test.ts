import { afterEach, describe, expect, it } from 'vitest';

import { createI18nNext } from '@/locales/create';

describe('createI18nNext', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('preloads zh-CN bundled namespaces synchronously', async () => {
    const i18n = createI18nNext('zh-CN');

    await i18n.init({ initAsync: false });

    expect(i18n.instance.hasResourceBundle('zh-CN', 'chat')).toBe(true);
    expect(i18n.instance.t('tab.home', { ns: 'common' })).toBe('首页');
  });

  it('dynamically loads missing namespaces after preloading bundled defaults', async () => {
    const i18n = createI18nNext('en-US');

    await i18n.init({ initAsync: false });
    expect(i18n.instance.hasResourceBundle('en-US', 'setting')).toBe(false);

    await i18n.instance.loadNamespaces(['setting']);

    expect(i18n.instance.hasResourceBundle('en-US', 'setting')).toBe(true);
    expect(i18n.instance.t('tab.common', { ns: 'setting' })).toBe('Appearance');
  });
});
