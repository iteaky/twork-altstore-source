/* TWORK website analytics — opt-in only; does not run in the iOS app. */
(function () {
  'use strict';

  const config = window.TWORK_ANALYTICS_CONFIG || {};
  const gaId = /^G-[A-Z0-9]{5,20}$/.test(config.ga4MeasurementId || '') ? config.ga4MeasurementId : '';
  const clarityId = /^[a-zA-Z0-9]{5,24}$/.test(config.clarityProjectId || '') ? config.clarityProjectId : '';

  // No configured collector = no banner, no cookies, no network requests.
  if (!gaId && !clarityId) return;

  const storageKey = 'twork.website-analytics-consent.v1';
  const translations = {
    ru: {
      settings: 'Настройки приватности', heading: 'Аналитика сайта TWORK',
      intro: 'Помогите нам понять, как используют сайт. Статистика и записи действий включаются только с вашего согласия. Поля формы заявки не передаются в наши события.',
      accept: 'Принять всё', reject: 'Отклонить всё', customize: 'Настроить',
      save: 'Сохранить выбор', back: 'Назад',
      stats: 'Статистика посещений (Google Analytics)',
      statsHint: 'Страницы, источники переходов, устройства, нажатия кнопок и заявки.',
      replay: 'Тепловые карты и записи сессий (Microsoft Clarity)',
      replayHint: 'Клики, прокрутка и воспроизведение взаимодействий; поля форм маскируются.',
      required: 'Статистика должна быть включена для записей поведения.',
      policy: 'Подробнее — в политике конфиденциальности.'
    },
    en: {
      settings: 'Privacy settings', heading: 'TWORK website analytics',
      intro: 'Help us improve the site. Analytics and session recordings run only with your permission. We do not send the contents of signup form fields in our events.',
      accept: 'Accept all', reject: 'Reject all', customize: 'Customize',
      save: 'Save choices', back: 'Back',
      stats: 'Visit statistics (Google Analytics)',
      statsHint: 'Pages, traffic sources, devices, button clicks and signup conversions.',
      replay: 'Heatmaps and session recordings (Microsoft Clarity)',
      replayHint: 'Clicks, scrolling and interaction replay; form inputs are masked.',
      required: 'Statistics must be enabled to allow recordings.',
      policy: 'Details in the privacy policy.'
    },
    sk: {
      settings: 'Nastavenia súkromia', heading: 'Analytika webu TWORK',
      intro: 'Pomôžte nám zlepšovať web. Štatistiky a záznamy návštev zapneme iba s vaším súhlasom. Obsah polí formulárov neodosielame v udalostiach.',
      accept: 'Prijať všetko', reject: 'Odmietnuť všetko', customize: 'Prispôsobiť',
      save: 'Uložiť výber', back: 'Späť',
      stats: 'Štatistika návštev (Google Analytics)',
      statsHint: 'Stránky, zdroje návštev, zariadenia, kliknutia a žiadosti.',
      replay: 'Teplotné mapy a záznamy relácií (Microsoft Clarity)',
      replayHint: 'Kliknutia, posúvanie a prehrávanie interakcií; polia formulára sú maskované.',
      required: 'Pre záznamy relácií musí byť povolená štatistika.',
      policy: 'Podrobnosti nájdete v zásadách ochrany súkromia.'
    }
  };
  const css = ''
    + ':host{all:initial;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#171923}'
    + '*{box-sizing:border-box}.privacy-trigger{position:fixed;right:12px;bottom:12px;z-index:2147483642;font:600 12px/1.3 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#fff;background:#30313b;border:1px solid #55515c;border-radius:999px;box-shadow:0 8px 24px #0003;padding:8px 12px;cursor:pointer}'
    + '.panel{position:fixed;z-index:2147483643;bottom:14px;left:14px;width:min(470px,calc(100vw - 28px));padding:20px;background:#fff;color:#15151e;border-radius:18px;border:1px solid #d7d3dc;box-shadow:0 12px 50px #0005;font:400 14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}'
    + 'h2{font-size:20px;line-height:1.25;margin:0 0 10px;color:#171923}p{margin:0 0 14px;color:#393843}a{color:#b92472;text-underline-offset:3px}.buttons{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}'
    + 'button{cursor:pointer;border-radius:11px;border:1px solid #bab6c0;background:#fff;color:#24212b;font:600 13px/1.2 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;padding:12px 14px;min-height:42px}'
    + 'button.primary{background:#c83179;border-color:#c83179;color:#fff}button:focus-visible,input:focus-visible,a:focus-visible{outline:3px solid #d45593;outline-offset:3px}'
    + '.choice{display:flex;align-items:flex-start;gap:10px;padding:13px 0;border-top:1px solid #ebe6ec}.choice input{width:19px;height:19px;accent-color:#c83179;margin-top:2px;flex-shrink:0}.choice strong{display:block;color:#16151d;font-size:14px}.choice small{display:block;color:#514b59;font-size:12px;line-height:1.45;margin-top:4px}'
    + '.footnote{font-size:12px;margin-top:12px;color:#5e5764}.hint{color:#a02259;font-size:12px}.hidden{display:none!important}'
    + '@media(max-width:480px){.panel{bottom:8px;left:8px;width:calc(100vw - 16px);padding:16px}.buttons button{flex:1}}';
  const getLanguage = () => {
    const value = (document.documentElement.lang || 'en').toLowerCase().split('-')[0];
    return translations[value] ? value : 'en';
  };
  const safeRead = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved && saved.version === 1 && typeof saved.analytics === 'boolean' && typeof saved.recordings === 'boolean') {
        return { analytics: saved.analytics, recordings: saved.analytics && saved.recordings };
      }
    } catch (_) { /* private browsing / storage unavailable */ }
    return null;
  };
  let consent = safeRead();
  let view = consent ? 'closed' : 'banner';
  let gaStarted = false;
  let clarityStarted = false;
  let sentPageView = false;
  const scrollEventsSent = new Set();
  let formStarted = false;

  function sanitizedLocation() {
    const allowed = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    const query = new URLSearchParams();
    const params = new URLSearchParams(location.search);
    for (const key of allowed) {
      const value = params.get(key);
      if (value && /^[a-zA-Z0-9_.\/-]{1,60}$/.test(value)) query.set(key, value);
    }
    return location.origin + location.pathname + (query.toString() ? '?' + query.toString() : '');
  }

  function fire(name, properties) {
    if (!gaStarted || !consent || !consent.analytics || typeof window.gtag !== 'function') return;
    // No untrusted/free-text fields, form values, phone numbers or email addresses.
    const payload = Object.assign({ transport_type: 'beacon' }, properties || {});
    window.gtag('event', name, payload);
  }

  function loadScript(url, name) {
    if (document.querySelector('script[data-twork-collector="' + name + '"]')) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = url;
    script.dataset.tworkCollector = name;
    document.head.appendChild(script);
  }

  function activateStatistics() {
    if (!gaId || gaStarted || !consent || !consent.analytics) return;
    gaStarted = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window['ga-disable-' + gaId] = false;
    window.gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('set', 'allow_google_signals', false);
    window.gtag('set', 'allow_ad_personalization_signals', false);
    window.gtag('config', gaId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_flags: 'SameSite=Lax;Secure'
    });
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId), 'ga4');
    if (!sentPageView) {
      sentPageView = true;
      const referrer = document.referrer ? (() => {
        try { return new URL(document.referrer).origin + '/'; } catch (_) { return ''; }
      })() : '';
      fire('page_view', {
        page_location: sanitizedLocation(),
        page_title: document.title.slice(0, 120),
        page_referrer: referrer
      });
      if (new URLSearchParams(location.search).get('access') === 'sent') {
        let pending = false;
        try {
          pending = sessionStorage.getItem('twork.lead-submitted.v1') === '1';
          sessionStorage.removeItem('twork.lead-submitted.v1');
        } catch (_) { /* unavailable in strict private browsing */ }
        if (pending) fire('generate_lead', { lead_type: 'early_access_confirmation' });
      }
    }
  }

  function safeForReplay() {
    // Clarity captures page/referrer URLs: never load replay on unrecognized query strings.
    const allowed = new Set(['lang', 'access', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']);
    const params = new URLSearchParams(location.search);
    for (const [key, value] of params.entries()) {
      if (!allowed.has(key) || value.length > 60 || /[@<>{}\s]/.test(value)) return false;
    }
    return true;
  }

  function activateRecordings() {
    if (!clarityId || clarityStarted || !consent || !consent.recordings || !consent.analytics || !safeForReplay()) return;
    clarityStarted = true;
    // Clarity masks form inputs by default. Explicitly mask every form as defense-in-depth.
    document.querySelectorAll('form, input, textarea, select, [contenteditable="true"]')
      .forEach(element => element.setAttribute('data-clarity-mask', 'True'));
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    // Microsoft Clarity Consent V2; never request ad tracking.
    window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
    loadScript('https://www.clarity.ms/tag/' + clarityId, 'clarity');
  }

  function startAllowedCollectors() {
    if (consent && consent.analytics) activateStatistics();
    if (consent && consent.recordings) activateRecordings();
  }

  function clearGaCookies() {
    // Delete first-party GA cookies, including cookies scoped to this GitHub Pages project.
    const pathChoices = ['/', '/twork-altstore-source/'];
    for (const part of document.cookie.split(';')) {
      const name = part.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) continue;
      for (const path of pathChoices) {
        document.cookie = name + '=; Max-Age=0; path=' + path + '; SameSite=Lax';
      }
    }
  }

  function persist(next) {
    const previous = consent;
    consent = {
      analytics: Boolean(next.analytics),
      recordings: Boolean(next.analytics && next.recordings)
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        version: 1,
        analytics: consent.analytics,
        recordings: consent.recordings,
        updatedAt: new Date().toISOString()
      }));
    } catch (_) { /* Choice still applies to the current page. */ }
    view = 'closed';

    // A loaded third-party recorder cannot be reliably removed by deleting its script.
    // If permissions are withdrawn, immediately reload with collectors fully blocked.
    const statsWithdrawn = gaStarted && !consent.analytics;
    const replayWithdrawn = clarityStarted && !consent.recordings;
    if (statsWithdrawn || replayWithdrawn) {
      if (gaStarted) {
        window['ga-disable-' + gaId] = true;
        clearGaCookies();
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        });
      }
      if (clarityStarted && typeof window.clarity === 'function') {
        window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
        window.clarity('consent', false);
      }
      window.location.reload();
      return;
    }
    startAllowedCollectors();
    draw();
  }

  let shadow;
  function draw() {
    if (!shadow) return;
    const t = translations[getLanguage()];
    const privacy = new URL('privacy/', document.querySelector('link[rel="canonical"]')?.href || location.href);
    // Build an explicit site-root policy link rather than a path relative to the feature page.
    const policyUrl = (() => {
      const s = document.querySelector('script[data-twork-analytics-base]');
      if (s) return new URL('../privacy/', s.src).href;
      return privacy.href;
    })();
    const showBanner = view === 'banner';
    const showPreferences = view === 'preferences';
    const tEsc = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    shadow.innerHTML = '<style>' + css + '</style>'
      + '<button type="button" class="privacy-trigger' + (showBanner || showPreferences ? ' hidden' : '') + '" data-action="settings">' + tEsc(t.settings) + '</button>'
      + (showBanner || showPreferences ? '<section class="panel" role="region" aria-label="' + tEsc(t.heading) + '">'
      + '<h2>' + tEsc(t.heading) + '</h2>'
      + (showBanner ? '<p>' + tEsc(t.intro) + '</p><div class="buttons">'
      + '<button type="button" data-action="reject">' + tEsc(t.reject) + '</button>'
      + '<button type="button" data-action="customize">' + tEsc(t.customize) + '</button>'
      + '<button class="primary" type="button" data-action="accept">' + tEsc(t.accept) + '</button></div>'
      : '<p>' + tEsc(t.intro) + '</p>'
      + '<label class="choice"><input type="checkbox" id="twork-statistics" ' + (consent?.analytics ? 'checked' : '') + '><span><strong>' + tEsc(t.stats) + '</strong><small>' + tEsc(t.statsHint) + '</small></span></label>'
      + '<label class="choice"><input type="checkbox" id="twork-recordings" ' + (consent?.recordings ? 'checked' : '') + '><span><strong>' + tEsc(t.replay) + '</strong><small>' + tEsc(t.replayHint) + '</small></span></label>'
      + '<p class="hint" id="recording-required" hidden>' + tEsc(t.required) + '</p>'
      + '<div class="buttons"><button type="button" data-action="reject">' + tEsc(t.reject) + '</button><button type="button" data-action="back">' + tEsc(t.back) + '</button><button class="primary" type="button" data-action="save">' + tEsc(t.save) + '</button></div>')
      + '<p class="footnote"><a href="' + policyUrl + '">' + tEsc(t.policy) + '</a></p></section>' : '');
  }

  function installInterface() {
    if (!document.body || shadow) return;
    const host = document.createElement('div');
    host.id = 'twork-analytics-host';
    host.setAttribute('data-twork-analytics-ui', 'true');
    shadow = host.attachShadow({ mode: 'open' });
    document.body.appendChild(host);
    shadow.addEventListener('click', event => {
      const btn = event.target.closest('button[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      if (action === 'settings' || action === 'customize') {
        view = 'preferences';
        draw();
      } else if (action === 'back') {
        view = consent ? 'closed' : 'banner';
        draw();
      } else if (action === 'reject') {
        persist({ analytics: false, recordings: false });
      } else if (action === 'accept') {
        persist({ analytics: true, recordings: true });
      } else if (action === 'save') {
        const stats = shadow.getElementById('twork-statistics').checked;
        const replay = shadow.getElementById('twork-recordings').checked;
        if (replay && !stats) {
          shadow.getElementById('recording-required').hidden = false;
          return;
        }
        persist({ analytics: stats, recordings: replay });
      }
    });
    // The site changes its language dynamically. Do not recreate interactive controls:
    // Playwright and real users may be clicking them while the locale is updated.
    const updateLanguageText = () => {
      if (!shadow) return;
      const t = translations[getLanguage()];
      const set = (selector, text) => {
        const node = shadow.querySelector(selector);
        if (node) node.textContent = text;
      };
      set('.privacy-trigger', t.settings);
      set('.panel h2', t.heading);
      set('.panel > p', t.intro);
      for (const [action, key] of [
        ['accept', 'accept'], ['reject', 'reject'], ['customize', 'customize'],
        ['save', 'save'], ['back', 'back']
      ]) set('button[data-action="' + action + '"]', t[key]);
      const choices = shadow.querySelectorAll('.choice');
      if (choices[0]) {
        choices[0].querySelector('strong').textContent = t.stats;
        choices[0].querySelector('small').textContent = t.statsHint;
      }
      if (choices[1]) {
        choices[1].querySelector('strong').textContent = t.replay;
        choices[1].querySelector('small').textContent = t.replayHint;
      }
      set('#recording-required', t.required);
      set('.footnote a', t.policy);
    };
    let renderedLocale = getLanguage();
    new MutationObserver(mutations => {
      if (!mutations.some(m => m.attributeName === 'lang')) return;
      const now = getLanguage();
      if (now === renderedLocale) return;
      renderedLocale = now;
      updateLanguageText();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    draw();
  }

  function sectionName(element) {
    if (element.closest('.hero, .hero-actions')) return 'hero';
    if (element.closest('header, .site-nav')) return 'header';
    if (element.closest('footer, .site-footer')) return 'footer';
    if (element.closest('.final-section')) return 'final';
    if (element.closest('#access-modal')) return 'signup';
    if (element.closest('nav')) return 'navigation';
    return 'content';
  }

  function safeDestination(link) {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('mailto:')) return 'email';
    if (href.startsWith('tel:')) return 'phone';
    try {
      const url = new URL(href, location.href);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'other';
      return url.origin === location.origin ? url.pathname.slice(0, 110) : url.hostname.slice(0, 80);
    } catch (_) { return 'other'; }
  }

  function installEvents() {
    document.addEventListener('click', event => {
      if (!consent || !consent.analytics || !gaStarted) return;
      const element = event.target instanceof Element && event.target.closest('a,button,[role="button"]');
      if (!element || element.closest('#twork-analytics-host')) return;
      const area = sectionName(element);
      if (element.matches('.js-access')) {
        fire('early_access_click', { area: area });
      } else if (element.matches('.js-android-interest')) {
        fire('android_interest_click', { area: area });
      } else if (element.matches('.language-option')) {
        const language = element.getAttribute('data-language') || '';
        if (/^[A-Za-z-]{2,8}$/.test(language)) fire('language_change', { language: language });
      } else if (element.matches('a')) {
        fire('navigation_click', { area: area, destination: safeDestination(element) });
      } else if (!element.closest('form')) {
        fire('interface_click', { area: area });
      }
    }, { capture: true });

    document.addEventListener('focusin', event => {
      if (formStarted || !consent || !consent.analytics || !gaStarted) return;
      if (event.target.matches('input,textarea,select') && event.target.closest('#access-modal form')) {
        formStarted = true;
        fire('lead_form_start', { form_type: 'early_access' });
      }
    });

    document.addEventListener('submit', event => {
      if (event.target.matches('#access-modal form')) {
        if (consent && consent.analytics) {
          try { sessionStorage.setItem('twork.lead-submitted.v1', '1'); } catch (_) {}
        }
        fire('lead_submit_attempt', { form_type: 'early_access' });
      }
    });

    let pending = false;
    window.addEventListener('scroll', () => {
      if (pending || !consent || !consent.analytics || !gaStarted) return;
      pending = true;
      requestAnimationFrame(() => {
        pending = false;
        const denominator = document.documentElement.scrollHeight - window.innerHeight;
        const percent = denominator > 0 ? (window.scrollY / denominator) * 100 : 0;
        for (const step of [50, 90]) {
          if (percent >= step && !scrollEventsSent.has(step)) {
            scrollEventsSent.add(step);
            fire('scroll_depth', { percent_scrolled: step });
          }
        }
      });
    }, { passive: true });
  }

  function initialize() {
    installInterface();
    installEvents();
    startAllowedCollectors();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
