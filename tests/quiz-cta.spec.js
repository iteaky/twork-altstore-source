import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

test('landing keeps the current icon loader', async () => {
  const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
  expect(html).toContain('site/global-icon-shape-fix.js?v=20260618-6');
});

test('early access button opens and closes the real signup modal', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  const button = page.locator('.hero-actions .js-access');
  await expect(button).toBeVisible();
  await expect(button).toContainText(/ранний доступ|early access/i);
  await button.click();

  const modal = page.locator('#access-modal');
  await expect(modal).toHaveClass(/open/);
  await expect(modal).toHaveAttribute('aria-hidden', 'false');
  await expect(modal.locator('#access-title')).toBeVisible();
  await expect(modal.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('body')).toHaveClass(/modal-open/);

  await page.keyboard.press('Escape');
  await expect(modal).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('body')).not.toHaveClass(/modal-open/);
});
