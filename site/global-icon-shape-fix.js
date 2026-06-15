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

  const loadV542Hero = () => {
    if (document.querySelector('[data-twork-v542-hero]')) return;

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'site/hero-v542-club-scroll.css?v=20260615-1';
    stylesheet.dataset.tworkV542Hero = 'styles';
    document.head.appendChild(stylesheet);

    const script = document.createElement('script');
    script.src = 'site/hero-v542-club-scroll.js?v=20260615-1';
    script.async = false;
    script.dataset.tworkV542Hero = 'script';
    document.head.appendChild(script);
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
