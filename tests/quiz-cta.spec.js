import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

test('landing uses the refreshed loader URL', async () => {
  const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
  expect(html).toContain('site/global-icon-shape-fix.js?v=20260618-6');
});

test('setup button opens the onboarding quiz', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const button = page.getByRole('button', {
    name: /пройти квиз настройки|start the setup quiz|spustiť kvíz nastavenia/i
  });
  await expect(button).toBeVisible();
  await button.click();

  const quiz = page.locator('#twork-onboarding-quiz-v6');
  await expect(quiz).toBeVisible();
  await expect(quiz).toHaveAttribute('aria-hidden', 'false');
  await expect(quiz.getByText(/первая настройка|first setup|prvé nastavenie/i)).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/quiz-open/);
});
