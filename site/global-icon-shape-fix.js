(() => {
  const root = document.documentElement;

  const apply = () => {
    const icon = document.querySelector('.global-center');
    if (!icon) return;

    if (root.dataset.theme === 'brand-dark') {
      icon.style.setProperty('background-size', '100% 100%', 'important');
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }

  new MutationObserver(apply).observe(root, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
  window.addEventListener('resize', apply, { passive: true });
})();
