import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

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

  const before = await page.evaluate(() => {
    const payloadNames = ['__TWQ4_CSS', '__TWQ4_I18N', '__TWQ4_JS1', '__TWQ4_JS2'];
    const payloads = Object.fromEntries(payloadNames.map(name => {
      const value = window[name];
      let atobStatus = 'missing';
      if (typeof value === 'string') {
        try {
          atob(value);
          atobStatus = 'valid';
        } catch (error) {
          atobStatus = `${error.name}: ${error.message}`;
        }
      }
      return [name, {
        type: typeof value,
        length: typeof value === 'string' ? value.length : 0,
        invalidCharacters: typeof value === 'string' ? [...new Set(value.match(/[^A-Za-z0-9+/=]/g) || [])] : [],
        atobStatus
      }];
    }));

    return {
      loader: [...document.scripts].map(script => script.src).filter(Boolean).filter(src => src.includes('global-icon-shape-fix')),
      nativeLauncherType: typeof window.TWORK_OPEN_NATIVE_QUIZ,
      ctaCount: document.querySelectorAll('[data-quiz-end-open]').length,
      ctaAttributes: [...document.querySelectorAll('[data-quiz-end-open]')].map(element => [...element.attributes].reduce((result, attribute) => ({ ...result, [attribute.name]: attribute.value }), {})),
      payloads
    };
  });
  console.log('QUIZ_CTA_BEFORE', JSON.stringify(before));
  console.log('QUIZ_CTA_ERRORS_BEFORE', JSON.stringify(errors));

  await page.evaluate(() => {
    document.querySelector('[data-quiz-end-open]')?.click();
  });

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

  const after = await page.evaluate(() => ({
    bodyClass: document.body.className,
    htmlClass: document.documentElement.className,
    nativeLauncherType: typeof window.TWORK_OPEN_NATIVE_QUIZ,
    dialogs: [...document.querySelectorAll('dialog,[role="dialog"],[aria-modal="true"]')].map(element => ({
      id: element.id,
      className: typeof element.className === 'string' ? element.className : '',
      hidden: element.hidden,
      ariaHidden: element.getAttribute('aria-hidden'),
      display: getComputedStyle(element).display,
      visibility: getComputedStyle(element).visibility,
      opacity: getComputedStyle(element).opacity,
      text: (element.textContent || '').trim().slice(0, 160)
    }))
  }));
  console.log('QUIZ_CTA_AFTER', JSON.stringify(after));

  expect(errors.filter(message => !/favicon/i.test(message))).toEqual([]);
});
