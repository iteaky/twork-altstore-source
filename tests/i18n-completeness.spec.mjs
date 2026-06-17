import { test, expect } from '@playwright/test';

const LANGUAGES = ['sk','en','ru','cs','hu','pl','de','uk','es','fr','pt','ar','zh-Hans','ja','ko'];
const CYRILLIC = /[\u0400-\u052f]/u;
const RUSSIAN_ONLY = /[ЁёЫыЭэЪъ]/u;
const LETTER = /\p{L}/u;
const LATIN = /[A-Za-zÀ-ÖØ-öø-ÿĀ-ž]/u;
const ARABIC = /[\u0600-\u06ff]/u;
const HAN = /[\u3400-\u9fff]/u;
const JAPANESE = /[\u3040-\u30ff\u3400-\u9fff]/u;
const HANGUL = /[\uac00-\ud7af]/u;

const LANGUAGE_NEUTRAL = [
  /^TWORK$/i,
  /^iOS$/i,
  /^Apple Calendar$/i,
  /^Online$/i,
  /^Offline$/i,
  /^Sync$/i,
  /^Split$/i,
  /^Iron Club$/i,
  /^Anna Kovalova$/i,
  /^Анна Ковалёва$/i,
  /^Максим и Олег$/i,
  /^Mark$/i,
  /^Classic (Light|Dark)$/i,
  /^Brand (Light|Dark)$/i,
  /^\d{1,2}:\d{2}$/,
  /^[+−-]?\s?[€$£¥₽₴₩₹]?\s?\d[\d.,\s]*$/u,
  /^[●○+＋×✎✓⌄☷↓·•\s]+$/u
];

const normalize = value => String(value ?? '')
  .replace(/[\u200b-\u200d\ufeff]/g, '')
  .replace(/\u00a0/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const isNeutral = value => {
  const text = normalize(value);
  return !text || LANGUAGE_NEUTRAL.some(pattern => pattern.test(text));
};

const wordCount = value => normalize(value).split(/\s+/).filter(Boolean).length;
const letterCount = value => [...normalize(value)].filter(character => LETTER.test(character)).length;
const isSubstantial = value => wordCount(value) >= 2 || letterCount(value) >= 12;

async function materializeDynamicContent(page) {
  const access = page.locator('.js-access').first();
  if (await access.count()) {
    await access.click({ force: true }).catch(() => {});
    await page.waitForTimeout(120);
  }
}

async function waitForLanguage(page, language) {
  await page.waitForFunction(expected => {
    const root = document.documentElement;
    return root.dataset.siteLanguage === expected && !root.classList.contains('language-switch-busy');
  }, language, { timeout: 10_000 });
  await page.waitForTimeout(650);
}

async function loadLanguage(page, language) {
  await page.goto(`/?lang=${encodeURIComponent(language)}`, { waitUntil: 'networkidle' });
  await waitForLanguage(page, language);
  await materializeDynamicContent(page);
  await page.waitForTimeout(250);
  return captureAudit(page);
}

async function captureAudit(page) {
  return page.evaluate(() => {
    const normalizeInPage = value => String(value ?? '')
      .replace(/[\u200b-\u200d\ufeff]/g, '')
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const hasLetter = value => /\p{L}/u.test(value);
    const excluded = element => Boolean(element?.closest?.(
      'script,style,noscript,template,svg,.language-switcher,.locale-v9-layer,.matrix-language-transition'
    ));
    const isCustom = element => Boolean(element?.closest?.(
      'article,[class*="card"],[class*="preview"],[class*="screen"],[class*="modal"],[role="dialog"],[class*="calendar"],[class*="club"],[class*="message"]'
    ));

    const elementPath = element => {
      if (!element || element === document.body) return 'body';
      const parts = [];
      let current = element;
      while (current && current !== document.body) {
        const parent = current.parentElement;
        if (!parent) break;
        const index = Array.from(parent.children).indexOf(current) + 1;
        parts.unshift(`${current.tagName.toLowerCase()}:nth-child(${index})`);
        current = parent;
      }
      return `body>${parts.join('>')}`;
    };

    const slots = {};
    const add = (id, value, meta = {}) => {
      const normalized = normalizeInPage(value);
      if (!normalized || !hasLetter(normalized)) return;
      slots[id] = { value: normalized, ...meta };
    };

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent || excluded(parent)) continue;
      const textIndex = Array.from(parent.childNodes)
        .filter(child => child.nodeType === Node.TEXT_NODE)
        .indexOf(node);
      add(`${elementPath(parent)}::text(${textIndex})`, node.nodeValue, {
        custom: isCustom(parent),
        marker: node.__tworkI18nKey || node.__tworkExtraKey || node.__tworkV4Source || null
      });
    }

    const attributes = ['placeholder','aria-label','title','alt'];
    for (const element of document.body.querySelectorAll('*')) {
      if (excluded(element)) continue;
      const path = elementPath(element);
      for (const attribute of attributes) {
        if (element.hasAttribute(attribute)) {
          add(`${path}@${attribute}`, element.getAttribute(attribute), {
            custom: isCustom(element),
            attribute
          });
        }
      }

      for (const pseudo of ['::before','::after']) {
        const content = getComputedStyle(element, pseudo).content;
        if (!content || content === 'none' || content === 'normal') continue;
        const clean = content.replace(/^['"]|['"]$/g, '');
        add(`${path}${pseudo}`, clean, {
          custom: isCustom(element),
          pseudo
        });
      }
    }

    add('document@title', document.title, { metadata: true });
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]'
    ]) {
      const meta = document.querySelector(selector);
      if (meta) add(`head>${selector}@content`, meta.content, { metadata: true });
    }

    return {
      language: document.documentElement.dataset.siteLanguage,
      htmlLang: document.documentElement.lang,
      direction: document.documentElement.dir,
      residual: Number(document.documentElement.dataset.i18nResidual || 0),
      slots
    };
  });
}

function compareLanguage({ language, russian, english, target }) {
  const failures = [];
  const sourceEntries = Object.entries(russian.slots)
    .filter(([, slot]) => CYRILLIC.test(slot.value) && !isNeutral(slot.value));

  for (const [id, sourceSlot] of sourceEntries) {
    const translated = target.slots[id]?.value;
    const englishValue = english.slots[id]?.value;

    if (!translated) {
      failures.push(`${id}: missing translation for “${sourceSlot.value}”`);
      continue;
    }

    if (language !== 'ru' && isSubstantial(sourceSlot.value) && normalize(translated) === normalize(sourceSlot.value)) {
      failures.push(`${id}: unchanged Russian source “${sourceSlot.value}”`);
    }

    if (!['ru','uk'].includes(language) && CYRILLIC.test(translated)) {
      failures.push(`${id}: Cyrillic remains in ${language}: “${translated}”`);
    }

    if (language === 'uk' && RUSSIAN_ONLY.test(translated)) {
      failures.push(`${id}: Russian-only letters remain in Ukrainian: “${translated}”`);
    }

    if (
      !['en','ru'].includes(language) &&
      englishValue &&
      isSubstantial(sourceSlot.value) &&
      isSubstantial(englishValue) &&
      normalize(translated).toLocaleLowerCase() === normalize(englishValue).toLocaleLowerCase() &&
      !isNeutral(englishValue)
    ) {
      failures.push(`${id}: hidden English fallback in ${language}: “${translated}”`);
    }
  }

  return { failures, sourceEntries };
}

function expectTargetScript(language, snapshot) {
  const substantialValues = Object.values(snapshot.slots)
    .map(slot => slot.value)
    .filter(value => isSubstantial(value));
  const count = regex => substantialValues.filter(value => regex.test(value)).length;

  if (language === 'ar') {
    expect(snapshot.direction, 'Arabic must use RTL').toBe('rtl');
    expect(count(ARABIC), 'Arabic text was not rendered').toBeGreaterThan(10);
  } else {
    expect(snapshot.direction, `${language} must use LTR`).toBe('ltr');
  }

  if (language === 'zh-Hans') expect(count(HAN), 'Chinese text was not rendered').toBeGreaterThan(10);
  if (language === 'ja') expect(count(JAPANESE), 'Japanese text was not rendered').toBeGreaterThan(10);
  if (language === 'ko') expect(count(HANGUL), 'Korean text was not rendered').toBeGreaterThan(10);
  if (['ru','uk'].includes(language)) expect(count(CYRILLIC), `${language} text was not rendered`).toBeGreaterThan(10);
  if (['sk','en','cs','hu','pl','de','es','fr','pt'].includes(language)) {
    expect(count(LATIN), `${language} Latin text was not rendered`).toBeGreaterThan(20);
  }
}

test.describe('TWORK localization completeness', () => {
  test('the audit covers the full page, cards, previews and custom blocks', async ({ page }) => {
    const russian = await loadLanguage(page, 'ru');
    const sourceSlots = Object.values(russian.slots).filter(slot => CYRILLIC.test(slot.value) && !isNeutral(slot.value));
    const customSlots = sourceSlots.filter(slot => slot.custom);
    const unregistered = sourceSlots.filter(slot => !slot.marker && !slot.attribute && !slot.metadata && !slot.pseudo);

    expect(sourceSlots.length, 'Too few Russian source slots were audited').toBeGreaterThan(60);
    expect(customSlots.length, 'Cards and custom blocks were not included in the audit').toBeGreaterThan(25);
    expect(unregistered, `Unregistered source strings:\n${unregistered.map(slot => slot.value).join('\n')}`).toEqual([]);
  });

  for (const language of LANGUAGES.filter(code => code !== 'ru')) {
    test(`${language}: every page and custom-block string is translated`, async ({ page }) => {
      const russian = await loadLanguage(page, 'ru');
      const english = await loadLanguage(page, 'en');
      const target = language === 'en' ? english : await loadLanguage(page, language);

      expect(target.language).toBe(language);
      expect(target.htmlLang).toBe(language);
      expectTargetScript(language, target);

      const { failures, sourceEntries } = compareLanguage({ language, russian, english, target });
      expect(sourceEntries.filter(([, slot]) => slot.custom).length).toBeGreaterThan(25);
      expect(failures, failures.join('\n')).toEqual([]);
      expect(target.residual, `${language} reports untranslated residual strings`).toBe(0);
    });
  }

  test('languages switch repeatedly without a reload or a lost click', async ({ page }) => {
    await page.goto('/?lang=ru', { waitUntil: 'networkidle' });
    await waitForLanguage(page, 'ru');

    for (const language of ['uk','en','sk','de','fr','ru','ja','ko','en']) {
      await page.locator('.language-switcher-button').click();
      const option = page.locator(`.language-option[data-language="${language}"]`);
      await expect(option).toBeVisible();
      await option.click();
      await waitForLanguage(page, language);
      await expect(page.locator('.language-current-code')).toHaveText(shortCodeForTest(language));
    }
  });
});

function shortCodeForTest(language) {
  return language === 'zh-Hans' ? 'ZH' : language.toUpperCase();
}
