import { test, expect } from '@playwright/test';

const LANGUAGES = ['sk','en','ru','cs','hu','pl','de','uk','es','fr','pt','ar','zh-Hans','ja','ko'];
const TOKEN = /\b(?:l10n|quiz)\.[A-Za-z0-9_.-]+\b/g;

async function waitForQuiz(page) {
  await page.waitForFunction(() => (
    window.__TWORK_QUIZ_V564_READY__ === true &&
    typeof window.TWORK_OPEN_SETUP_QUIZ === 'function'
  ), null, { timeout: 25_000 });
}

async function openQuiz(page, language = 'en') {
  await page.goto(`/?lang=${encodeURIComponent(language)}`, { waitUntil: 'networkidle' });
  await waitForQuiz(page);
  await page.evaluate(() => window.TWORK_OPEN_SETUP_QUIZ());
  const root = page.locator('#twork-onboarding-quiz-v6');
  await expect(root).toBeVisible();
  await expect(root).toHaveAttribute('aria-hidden', 'false');
  return root;
}

async function visibleTokens(root) {
  return root.evaluate((element, source) => {
    const token = new RegExp(source, 'g');
    const values = [element.innerText];
    for (const node of element.querySelectorAll('*')) {
      for (const attribute of ['placeholder','aria-label','title','alt']) {
        if (node.hasAttribute(attribute)) values.push(node.getAttribute(attribute));
      }
    }
    return [...new Set(values.flatMap(value => String(value || '').match(token) || []))];
  }, TOKEN.source);
}

async function select(root, action, value) {
  await root.locator(`[data-action="${action}"][data-value="${value}"]`).click();
}

async function continueFrom(root, step) {
  if (step === 'workplace') await select(root, 'workplace', 'privateClients');
  if (step === 'workFormat') await select(root, 'format', 'personal');
  if (step === 'subscriptions') await root.locator('[data-action="bool"][data-name="usesSubscriptions"][data-value="false"]').click();
  if (step === 'services') await root.locator('[data-action="bool"][data-name="usesServices"][data-value="false"]').click();
  if (step === 'currencies') await select(root, 'currency', 'EUR');
  if (step === 'trainingLocation') await select(root, 'location', 'offline');
  if (step === 'workingHours') await root.locator('[data-action="bool"][data-name="wantsWorkingHours"][data-value="false"]').click();
  if (step === 'paymentControl') await root.locator('[data-action="bool"][data-name="payment"][data-value="false"]').click();
  if (step === 'trainingPricesQuestion') await root.locator('[data-action="bool"][data-name="wantsPrices"][data-value="false"]').click();
  if (step === 'notifications') await root.locator('[data-action="bool"][data-name="notifications"][data-value="false"]').click();
  if (step === 'calendar') await root.locator('[data-action="bool"][data-name="calendar"][data-value="false"]').click();
  if (step === 'dataImport') await root.locator('[data-action="bool"][data-name="import"][data-value="false"]').click();
  await expect(root.locator('.twq564-next')).toBeEnabled();
  await root.locator('.twq564-next').click();
}

test.describe('TWORK iOS V564 quiz parity', () => {
  test('V564 runtime replaces the legacy quiz', async ({ page }) => {
    const root = await openQuiz(page, 'ru');
    await expect(root).toHaveClass(/twq564/);
    expect(await root.getAttribute('data-current-step')).toBe('welcome');
  });

  test('minimal path follows the iOS V564 page order', async ({ page }) => {
    const root = await openQuiz(page, 'en');
    const steps = [];
    for (let guard = 0; guard < 45; guard += 1) {
      const step = await root.getAttribute('data-current-step');
      if (steps.at(-1) !== step) steps.push(step);
      expect(await visibleTokens(root), `${step}: visible localization tokens`).toEqual([]);
      if (step === 'done') break;
      await continueFrom(root, step);
    }
    expect(steps).toEqual([
      'welcome','language','clientLanguages','theme','workplace','workFormat',
      'subscriptions','services','currencies','trainingLocation','duration',
      'workingHours','paymentControl','trainingPricesQuestion','notifications',
      'calendar','backup','dataImport','done'
    ]);
  });

  test('all supported languages open without raw localization tokens', async ({ page }) => {
    for (const language of LANGUAGES) {
      const root = await openQuiz(page, language);
      expect(await visibleTokens(root), `${language}: visible localization tokens`).toEqual([]);
      await root.locator('[data-action="close"]').click();
    }
  });
});