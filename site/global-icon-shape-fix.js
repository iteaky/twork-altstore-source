(() => {
  const root = document.documentElement;
  const supportedLanguages = new Set(['sk','en','ru','cs','hu','pl','de','uk','es','fr','pt','ar','zh-Hans','ja','ko']);

  const normalizeLanguage = value => {
    if (!value) return null;
    const normalized = String(value).replace('_','-');
    if (supportedLanguages.has(normalized)) return normalized;
    const lower = normalized.toLowerCase();
    if (lower.startsWith('zh')) return 'zh-Hans';
    const base = lower.split('-')[0];
    return supportedLanguages.has(base) ? base : null;
  };

  const resolveInitialLanguage = () => {
    const query = normalizeLanguage(new URLSearchParams(location.search).get('lang'));
    if (query) return query;
    const saved = normalizeLanguage(localStorage.getItem('twork-site-language'));
    if (saved) return saved;
    for (const candidate of navigator.languages || [navigator.language]) {
      const resolved = normalizeLanguage(candidate);
      if (resolved) return resolved;
    }
    return 'en';
  };

  const initialLanguage = resolveInitialLanguage();
  root.dataset.siteLanguage = initialLanguage;
  root.lang = initialLanguage;
  root.dir = initialLanguage === 'ar' ? 'rtl' : 'ltr';

  const apply = () => {
    const icon = document.querySelector('.global-center');
    if (!icon) return;

    if (root.dataset.theme === 'brand-dark') {
      icon.style.setProperty('background-size', '100% 104%', 'important');
      icon.style.setProperty('background-position', 'center', 'important');
      icon.style.setProperty('background-repeat', 'no-repeat', 'important');
      icon.style.setProperty('background-color', 'transparent', 'important');
      icon.style.setProperty('border-radius', window.matchMedia('(max-width:680px)').matches ? '27px' : '30px', 'important');
      icon.style.setProperty('overflow', 'hidden', 'important');
    } else {
      icon.style.removeProperty('background-size');
      icon.style.removeProperty('background-position');
      icon.style.removeProperty('background-repeat');
      icon.style.removeProperty('background-color');
      icon.style.removeProperty('border-radius');
      icon.style.removeProperty('overflow');
    }
  };

  const appendStylesheet = (href, key) => {
    if (document.querySelector('[data-twork-v542-style="' + key + '"]')) return;
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = href;
    stylesheet.dataset.tworkV542Style = key;
    document.head.appendChild(stylesheet);
  };

  const appendScript = (src, key) => {
    if (document.querySelector('[data-twork-v542-script="' + key + '"]')) return;
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset.tworkV542Script = key;
    document.head.appendChild(script);
  };

  const loadV542Hero = () => {
    appendStylesheet('site/hero-v542-club-scroll.css?v=20260615-2', 'club');
    appendStylesheet('site/hero-v543-desktop-pin.css?v=20260615-1', 'desktop-pin');
    appendStylesheet('site/hero-v545-home-wordmark-fix.css?v=20260615-1', 'home-wordmark-fix');
    appendStylesheet('site/hero-v548-unified-phone.css?v=20260615-3', 'unified-phone');
    appendStylesheet('site/hero-v549-mobile-jitter-fix.css?v=20260615-1', 'mobile-jitter-fix');
    appendStylesheet('site/hero-v547-timeline-midnight.css?v=20260615-1', 'timeline-midnight');
    appendStylesheet('site/landing-i18n.css?v=20260616-1', 'landing-i18n');
    appendStylesheet('site/landing-i18n-v5.css?v=20260616-3', 'landing-i18n-v5');
    appendStylesheet('site/landing-i18n-v9.css?v=20260617-4', 'landing-i18n-v9');
    appendStylesheet('site/landing-i18n-v10-visible.css?v=20260617-1', 'landing-i18n-v10-visible');
    appendStylesheet('site/landing-i18n-complete.css?v=20260617-7', 'landing-i18n-complete');
    appendStylesheet('site/mobile-header-interaction-fix.css?v=20260616-2', 'mobile-header-interaction-fix');
    appendStylesheet('site/onboarding-quiz-end-v1.css?v=20260617-1', 'onboarding-quiz-end-v1');

    appendScript('site/hero-v542-club-scroll.js?v=20260615-2', 'club');
    appendScript('site/hero-v543-desktop-pin.js?v=20260615-1', 'desktop-pin');
    appendScript('site/hero-v548-unified-phone.js?v=20260615-5', 'unified-phone');
    appendScript('site/hero-v547-timeline-midnight.js?v=20260615-1', 'timeline-midnight');
    appendScript('site/landing-i18n-stability.js?v=20260616-2', 'landing-i18n-stability');
    appendScript('site/landing-i18n-bridge.js?v=20260617-2', 'landing-i18n-bridge');
    appendScript('site/landing-i18n.js?v=20260616-2', 'landing-i18n');
    appendScript('site/landing-i18n-generated-extra.js?v=20260616-4', 'landing-i18n-generated-extra');
    appendScript('site/landing-i18n-v4-fixes.js?v=20260617-3', 'landing-i18n-v4-fixes');

    appendScript('site/landing-i18n-complete-keys.js?v=20260617-7', 'landing-i18n-complete-keys');
    appendScript('site/landing-i18n-complete-en.js?v=20260617-7', 'landing-i18n-complete-en');
    appendScript('site/landing-i18n-complete-sk.js?v=20260617-7', 'landing-i18n-complete-sk');
    appendScript('site/landing-i18n-complete-central.js?v=20260617-7', 'landing-i18n-complete-central');
    appendScript('site/landing-i18n-complete-north.js?v=20260617-7', 'landing-i18n-complete-north');
    appendScript('site/landing-i18n-complete-es.js?v=20260617-7', 'landing-i18n-complete-es');
    appendScript('site/landing-i18n-complete-fr.js?v=20260617-7', 'landing-i18n-complete-fr');

    for (const part of ['01','02','03','04','05','06','07','08','09','10','11','12a','12b','12c','13']) {
      appendScript(`site/i18n-final/cyr-${part}.js?v=20260617-7`, `landing-i18n-cyr-${part}`);
    }
    appendScript('site/i18n-final/cyr-decode.js?v=20260617-7', 'landing-i18n-cyr-decode');
    appendScript('site/landing-i18n-complete-overrides.js?v=20260617-7', 'landing-i18n-complete-overrides');
    appendScript('site/landing-i18n-complete.js?v=20260617-7', 'landing-i18n-complete');
    appendScript('site/landing-i18n-v9.js?v=20260617-7', 'landing-i18n-v9');

    appendScript('site/onboarding-native-v4-css.js?v=20260617-5', 'onboarding-native-v4-css');
    appendScript('site/onboarding-native-v4-i18n.js?v=20260617-5', 'onboarding-native-v4-i18n');
    appendScript('site/onboarding-native-v4-js1.js?v=20260617-5', 'onboarding-native-v4-js1');
    appendScript('site/onboarding-native-v4-js2.js?v=20260617-5', 'onboarding-native-v4-js2');
    appendScript('site/onboarding-native-v4-loader.js?v=20260617-5', 'onboarding-native-v4-loader');
    appendScript('site/onboarding-quiz-end-v1.js?v=20260617-1', 'onboarding-quiz-end-v1');
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, { once: true });
  else apply();

  if (document.readyState === 'complete') loadV542Hero();
  else window.addEventListener('load', loadV542Hero, { once: true });

  new MutationObserver(apply).observe(root, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
  window.addEventListener('resize', apply, { passive: true });
})();
