const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

test('landing ships a fresh loader URL for the quiz bundle', async () => {
  const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
  expect(html).toMatch(/site\/global-icon-shape-fix\.js\?v=20260618-/);
});

test('clicking the setup CTA opens the onboarding quiz', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  const cta = page.getByRole('button', {
    name: /пройти квиз настройки|start the setup quiz|spustiť kvíz nastavenia/i
  });

  await expect(cta).toBeVisible();
  await cta.click();

  await expect.poll(async () => page.evaluate(() => {
    const visible = element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
    };

    const quizText = /первая настройка|пропустить квиз|настроить twork|first setup|skip quiz|onboarding/i;
    const surfaces = [...document.querySelectorAll('dialog,[role="dialog"],[aria-modal="true"],[id*="quiz" i],[class*="quiz" i],[id*="onboarding" i],[class*="onboarding" i]')]
      .filter(element => !element.closest('#setup-quiz-end'))
      .filter(visible)
      .filter(element => quizText.test(element.textContent || ''));

    return document.body.classList.contains('quiz-open') ||
      document.documentElement.classList.contains('quiz-open') ||
      surfaces.length > 0;
  }), {
    message: `The setup CTA did not open the quiz. Browser errors: ${errors.join(' | ')}`,
    timeout: 10000
  }).toBe(true);

  expect(errors.filter(message => !/favicon/i.test(message))).toEqual([]);
});
