import { test, expect } from '@playwright/test';

async function fakeAnalytics(page) {
  const loaded = [];
  await page.route('**/analytics/config.js', route => route.fulfill({
    contentType: 'application/javascript',
    body: 'window.TWORK_ANALYTICS_CONFIG={ga4MeasurementId:"G-TEST1234",clarityProjectId:"abc1234"};'
  }));
  await page.route('https://www.googletagmanager.com/**', route => {
    loaded.push('ga4');
    return route.fulfill({ contentType: 'text/javascript', body: '/* stub */' });
  });
  await page.route('https://www.clarity.ms/**', route => {
    loaded.push('clarity');
    return route.fulfill({ contentType: 'text/javascript', body: '/* stub */' });
  });
  return loaded;
}

test('no real provider scripts and no consent banner without configured IDs', async ({ page }) => {
  await page.goto('/en/', { waitUntil: 'networkidle' });
  await expect(page.locator('#twork-analytics-host')).toHaveCount(0);
  await expect(page.locator('script[data-twork-collector]')).toHaveCount(0);
});

test('visitors are not tracked before consent; reject means no external requests', async ({ page }) => {
  const loaded = await fakeAnalytics(page);
  await page.goto('/en/', { waitUntil: 'networkidle' });
  await expect(page.locator('#twork-analytics-host [data-action="accept"]')).toBeVisible();
  expect(loaded).toEqual([]);
  await page.locator('#twork-analytics-host [data-action="reject"]').click();
  await expect(page.locator('#twork-analytics-host [data-action="settings"]')).toBeVisible();
  expect(loaded).toEqual([]);
  await page.reload({ waitUntil: 'networkidle' });
  expect(loaded).toEqual([]);
});

test('analytics and optional replay are separately consented to', async ({ page }) => {
  const loaded = await fakeAnalytics(page);
  await page.goto('/sk/', { waitUntil: 'networkidle' });
  await page.locator('#twork-analytics-host [data-action="customize"]').click();
  await page.locator('#twork-analytics-host #twork-statistics').check();
  await page.locator('#twork-analytics-host #twork-recordings').uncheck();
  await page.locator('#twork-analytics-host [data-action="save"]').click();
  expect(loaded).toContain('ga4');
  expect(loaded).not.toContain('clarity');
  const events = await page.evaluate(() => Array.from(window.dataLayer || []).filter(item => item[0] === 'event').map(item => item[1]));
  expect(events).toContain('page_view');

  await page.locator('#twork-analytics-host [data-action="settings"]').click();
  await page.locator('#twork-analytics-host #twork-recordings').check();
  await page.locator('#twork-analytics-host [data-action="save"]').click();
  expect(loaded).toContain('clarity');
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('twork.website-analytics-consent.v1')));
  expect(state.analytics).toBe(true);
  expect(state.recordings).toBe(true);
});

test('signup click/start tracked but private form values are never placed into events', async ({ page }) => {
  await fakeAnalytics(page);
  await page.goto('/?lang=en', { waitUntil: 'networkidle' });
  await page.locator('#twork-analytics-host [data-action="accept"]').click();
  await page.locator('.hero-actions .js-access').click();
  await page.locator('#access-modal input[name="Имя"]').fill('SECRET TEST USER');
  const serialized = await page.evaluate(() => JSON.stringify(Array.from(window.dataLayer || [])));
  expect(serialized).toContain('early_access_click');
  expect(serialized).toContain('lead_form_start');
  expect(serialized).not.toContain('SECRET TEST USER');
  await expect(page.locator('#access-modal form')).toHaveAttribute('data-clarity-mask', 'True');
});

test('withdrawal reloads page without loading analytics again', async ({ page }) => {
  const loaded = await fakeAnalytics(page);
  await page.goto('/en/', { waitUntil: 'networkidle' });
  await page.locator('#twork-analytics-host [data-action="accept"]').click();
  expect(loaded).toContain('ga4');
  expect(loaded).toContain('clarity');

  await page.locator('#twork-analytics-host [data-action="settings"]').click();
  await page.locator('#twork-analytics-host [data-action="reject"]').click();
  await page.waitForLoadState('networkidle');
  const afterRevocation = loaded.length;
  await page.reload({ waitUntil: 'networkidle' });
  expect(loaded.length).toBe(afterRevocation);
  const state = await page.evaluate(() => JSON.parse(localStorage.getItem('twork.website-analytics-consent.v1')));
  expect(state.analytics).toBe(false);
  expect(state.recordings).toBe(false);
});

test('recordings are not loaded for URLs with unknown or sensitive query parameters', async ({ page }) => {
  const loaded = await fakeAnalytics(page);
  await page.goto('/?email=hidden%40example.org', { waitUntil: 'networkidle' });
  await page.locator('#twork-analytics-host [data-action="accept"]').click();
  expect(loaded).toContain('ga4');
  expect(loaded).not.toContain('clarity');
  const payload = await page.evaluate(() => JSON.stringify(Array.from(window.dataLayer || [])));
  expect(payload).not.toContain('hidden@example.org');
});

test('GA4 conversion requires a submitted signup in this browser session', async ({ page }) => {
  await fakeAnalytics(page);
  await page.goto('/en/', { waitUntil: 'networkidle' });
  await page.locator('#twork-analytics-host [data-action="accept"]').click();

  await page.goto('/?access=sent', { waitUntil: 'networkidle' });
  let events = await page.evaluate(() => Array.from(window.dataLayer || []).filter(x => x[0] === 'event').map(x => x[1]));
  expect(events).not.toContain('generate_lead');

  await page.evaluate(() => {
    document.querySelector('#access-modal form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  await page.goto('/?access=sent', { waitUntil: 'networkidle' });
  events = await page.evaluate(() => Array.from(window.dataLayer || []).filter(x => x[0] === 'event').map(x => x[1]));
  expect(events).toContain('generate_lead');
  expect(await page.evaluate(() => sessionStorage.getItem('twork.lead-submitted.v1'))).toBeNull();
});
