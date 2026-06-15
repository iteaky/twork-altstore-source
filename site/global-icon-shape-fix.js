(() => {
  const root = document.documentElement;

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
    if (document.querySelector(`[data-twork-v542-style="${key}"]`)) return;
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = href;
    stylesheet.dataset.tworkV542Style = key;
    document.head.appendChild(stylesheet);
  };

  const appendScript = (src, key) => {
    if (document.querySelector(`[data-twork-v542-script="${key}"]`)) return;
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.dataset.tworkV542Script = key;
    document.head.appendChild(script);
  };

  const loadV542Hero = () => {
    appendStylesheet('site/hero-v542-club-scroll.css?v=20260615-2', 'club');
    appendStylesheet('site/hero-v542-mobile-sequence.css?v=20260615-3', 'mobile-sequence');
    appendStylesheet('site/hero-v542-mobile-sticky-fix.css?v=20260615-2', 'mobile-sticky-fix');
    appendStylesheet('site/hero-v542-mobile-home-fix.css?v=20260615-2', 'mobile-home-fix');
    appendStylesheet('site/hero-v543-mobile-realism.css?v=20260615-1', 'mobile-realism');
    appendScript('site/hero-v542-club-scroll.js?v=20260615-2', 'club');
    appendScript('site/hero-v542-mobile-sequence.js?v=20260615-3', 'mobile-sequence');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }

  if (document.readyState === 'complete') {
    loadV542Hero();
  } else {
    window.addEventListener('load', loadV542Hero, { once: true });
  }

  new MutationObserver(apply).observe(root, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
  window.addEventListener('resize', apply, { passive: true });
})();
