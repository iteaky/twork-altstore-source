import { test, expect } from '@playwright/test';

const LANGUAGES = ['sk','en','ru','cs','hu','pl','de','uk','es','fr','pt','ar','zh-Hans','ja','ko'];
const TOKEN = /\b(?:l10n|quiz)\.[A-Za-z0-9_.-]+\b/g;
const MINIMAL_FLOW = [
  'welcome','language','clientLanguages','theme','workplace','workFormat',
  'subscriptions','services','currencies','trainingLocation','duration',
  'workingHours','paymentControl','trainingPricesQuestion','notifications',
  'calendar','backup','dataImport','done'
];

async function waitForQuiz(page) {
  await page.waitForFunction(() => (
    window.__TWORK_QUIZ_V564_READY__ === true &&
    typeof window.TWORK_OPEN_SETUP_QUIZ === 'function'
  ), null, { timeout: 30_000 });
}

async function openQuiz(page, language = 'en') {
  await page.goto(`/?lang=${encodeURIComponent(language)}&v564-test=${Date.now()}`, {
    waitUntil: 'networkidle'
  });
  await waitForQuiz(page);
  await page.evaluate(() => window.TWORK_OPEN_SETUP_QUIZ());
  const root = page.locator('#twork-onboarding-quiz-v6');
  await expect(root).toBeVisible();
  await expect(root).toHaveAttribute('aria-hidden', 'false');
  await expect(root).toHaveClass(/tw564-root/);
  return root;
}

async function visibleTokens(root) {
  return root.evaluate((element, tokenSource) => {
    const token = new RegExp(tokenSource, 'g');
    const values = [element.innerText];
    for (const node of element.querySelectorAll('*')) {
      for (const attribute of ['placeholder','aria-label','title','alt']) {
        if (node.hasAttribute(attribute)) values.push(node.getAttribute(attribute));
      }
    }
    return [...new Set(values.flatMap(value => String(value || '').match(token) || []))];
  }, TOKEN.source);
}

async function continueMinimal(root) {
  const recommended = root.locator('.tw564-recommended:visible').first();
  if (await recommended.count()) {
    await recommended.click();
    return;
  }
  const next = root.locator('.tw564-next');
  await expect(next).toBeEnabled();
  await next.click();
}

test.describe('TWORK onboarding V564 parity', () => {
  test('minimal flow follows the iOS V564 page order', async ({ page }) => {
    const root = await openQuiz(page, 'en');
    const steps = [];

    for (let guard = 0; guard < 50; guard += 1) {
      const step = await root.getAttribute('data-current-step');
      expect(step, 'Quiz did not expose data-current-step').toBeTruthy();
      if (steps.at(-1) !== step) steps.push(step);
      expect(await visibleTokens(root), `${step}: raw localization tokens`).toEqual([]);
      if (step === 'done') break;
      await continueMinimal(root);
    }

    expect(steps).toEqual(MINIMAL_FLOW);
  });

  test('all supported languages open without raw localization tokens', async ({ page }) => {
    for (const language of LANGUAGES) {
      const root = await openQuiz(page, language);
      expect(await visibleTokens(root), `${language}: raw localization tokens`).toEqual([]);
      if (language === 'ar') await expect(root).toHaveAttribute('dir', 'rtl');
      await root.locator('[data-action="close"]').click();
    }
  });

  test('critical V564 keys exist in every language dictionary', async ({ page }) => {
    await page.goto('/?lang=en&v564-dictionary-audit=1', { waitUntil: 'networkidle' });
    await waitForQuiz(page);

    const audit = await page.evaluate(languages => {
      const keys = [
        'l10n.onboarding_subscriptions_usage_title',
        'l10n.onboarding_services_title',
        'l10n.onboarding_club_group_training_setup',
        'l10n.onboarding_club_default_client_payment',
        'l10n.onboarding_club_duty_title',
        'l10n.onboarding_club_fixed_payment_title',
        'l10n.onboarding_club_prices_title',
        'l10n.onboarding_club_summary_title',
        'l10n.onboarding_training_location_title',
        'l10n.configure_private_training_prices',
        'l10n.onboarding_price_source_title',
        'l10n.onboarding_subscription_package_format',
        'l10n.onboarding_finish_primary',
        'l10n.participant_ranges_overlap'
      ];
      const dictionaries = window.TWORK_QUIZ_IOS_I18N || {};
      return Object.fromEntries(languages.map(language => [
        language,
        keys.filter(key => {
          const value = dictionaries[language]?.[key];
          return typeof value !== 'string' || !value.trim() || value.trim() === key;
        })
      ]).filter(([, missing]) => missing.length));
    }, LANGUAGES);

    expect(audit, `Missing V564 translations:\n${JSON.stringify(audit, null, 2)}`).toEqual({});
  });
});