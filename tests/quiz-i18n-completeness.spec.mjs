import { test, expect } from '@playwright/test';

const LANGUAGES = ['sk','en','ru','cs','hu','pl','de','uk','es','fr','pt','ar','zh-Hans','ja','ko'];
const TOKEN = /\b(?:l10n|quiz)\.[A-Za-z0-9_.-]+\b/g;

async function waitForQuizRuntime(page) {
  await page.waitForFunction(() => (
    window.__TWORK_QUIZ_V554_READY__ === true &&
    typeof window.__TWQ554_SOURCE === 'string' &&
    window.__TWQ554_SOURCE.length > 80_000 &&
    window.TWORK_QUIZ_IOS_I18N
  ), null, { timeout: 20_000 });
}

async function openQuiz(page, language = 'en') {
  await page.goto(`/?lang=${encodeURIComponent(language)}`, { waitUntil: 'networkidle' });
  await waitForQuizRuntime(page);
  await page.locator('[data-quiz-end-open]').click();
  const root = page.locator('#twork-onboarding-quiz-v6');
  await expect(root).toBeVisible();
  await expect(root).toHaveAttribute('aria-hidden', 'false');
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

async function ensureMinimalStepCanContinue(root, step) {
  const skip = root.locator('.twq6-question-skip:not([hidden])');
  if (await skip.count()) {
    await skip.click();
    return 'navigated';
  }

  if (step === 'workFormat') {
    await root.locator('[data-action="toggle-work-format"][data-value="personal"]').click();
  } else if (step === 'workplace') {
    await root.locator('[data-action="workplace"][data-value="privateClients"]').click();
  } else if (step === 'currencies') {
    if (await root.locator('[data-action="add-currency"][data-value="EUR"]').count() === 0) {
      await root.locator('[data-action="toggle-currency-picker"]').click();
    }
    await root.locator('[data-action="add-currency"][data-value="EUR"]').click();
  } else {
    const requiredText = root.locator('input[type="text"]');
    for (let index = 0; index < await requiredText.count(); index += 1) {
      const input = requiredText.nth(index);
      if (!(await input.inputValue()).trim()) await input.fill('Test');
    }
    const numeric = root.locator('input[type="number"]');
    for (let index = 0; index < await numeric.count(); index += 1) {
      const input = numeric.nth(index);
      const value = Number(await input.inputValue());
      if (!Number.isFinite(value) || value <= 0) await input.fill('1');
    }
  }

  return 'ready';
}

test.describe('TWORK quiz localization and flow', () => {
  test('every quiz source key exists in every supported language', async ({ page }) => {
    await page.goto('/?lang=en', { waitUntil: 'networkidle' });
    await waitForQuizRuntime(page);

    const audit = await page.evaluate(languages => {
      const source = String(window.__TWQ554_SOURCE || '');
      const dynamicKeys = [
        'l10n.onboarding_app_icon_light_title',
        'l10n.onboarding_app_icon_light_subtitle',
        'l10n.onboarding_app_icon_dark_title',
        'l10n.onboarding_app_icon_dark_subtitle'
      ];
      const keys = [...new Set([
        ...(source.match(/l10n\.[A-Za-z0-9_]+/g) || []),
        ...dynamicKeys
      ])].sort();
      const dictionaries = window.TWORK_QUIZ_IOS_I18N || {};
      const missing = {};

      for (const language of languages) {
        const dictionary = dictionaries[language] || {};
        const absent = keys.filter(key => {
          const value = dictionary[key];
          return typeof value !== 'string' || !value.trim() || value.trim() === key;
        });
        if (absent.length) missing[language] = absent;
      }

      return { keyCount: keys.length, missing };
    }, LANGUAGES);

    expect(audit.keyCount, 'The source-key audit did not cover the full quiz').toBeGreaterThan(150);
    expect(audit.missing, `Missing quiz translations:\n${JSON.stringify(audit.missing, null, 2)}`).toEqual({});
  });

  test('the landing quiz section is localized for all supported languages', async ({ page }) => {
    const snapshots = {};
    for (const language of LANGUAGES) {
      await page.goto(`/?lang=${encodeURIComponent(language)}`, { waitUntil: 'networkidle' });
      const section = page.locator('#setup-quiz-end');
      await expect(section).toBeVisible();
      snapshots[language] = (await section.innerText()).replace(/\s+/g, ' ').trim();
    }

    for (const language of LANGUAGES.filter(code => code !== 'en')) {
      expect(
        snapshots[language],
        `${language} is falling back to the English quiz-section copy`
      ).not.toBe(snapshots.en);
    }
  });

  test('the minimal quiz path is ordered logically and exposes no localization tokens', async ({ page }) => {
    const root = await openQuiz(page, 'en');
    const steps = [];

    for (let guard = 0; guard < 40; guard += 1) {
      const step = await root.getAttribute('data-current-step');
      expect(step, 'Quiz did not expose its current step').toBeTruthy();
      if (steps.at(-1) !== step) steps.push(step);

      const tokens = await visibleTokens(root);
      expect(tokens, `${step}: visible localization tokens: ${tokens.join(', ')}`).toEqual([]);

      if (step === 'done') break;

      const next = root.locator('.twq6-next');
      if (await next.isDisabled()) {
        const result = await ensureMinimalStepCanContinue(root, step);
        if (result === 'navigated') continue;
      }
      await expect(next, `${step}: no valid way to continue`).toBeEnabled();
      await next.click();
    }

    expect(steps[0]).toBe('welcome');
    expect(steps.at(-1)).toBe('done');
    expect(steps).toEqual([
      'welcome','language','clientLanguages','theme','workFormat','workplace',
      'clientCardIntro','trainingLifecycle','duration','workingHours','subscriptions',
      'paymentControl','currencies','trainingPricesQuestion','notifications',
      'calendarTypesIntro','calendar','backup','dataImport','done'
    ]);
  });
});
