(() => {
  const desktopQuery = window.matchMedia('(min-width:681px)');

  const install = () => {
    const product = document.querySelector('#product.hero-scroll-product');
    const stage = product?.querySelector('.hero-phone-stage');
    const screen = product?.querySelector('.device-main .real-home-preview');
    const topLine = screen?.querySelector('.real-app-topline');
    const scrollContent = screen?.querySelector('.real-home-scroll-content');

    if (!product || !stage || !screen || !scrollContent) return false;
    if (product.dataset.desktopPinReady === 'true') return true;
    product.dataset.desktopPinReady = 'true';

    let frameRequested = false;

    const measure = () => {
      frameRequested = false;

      if (!desktopQuery.matches) {
        product.style.removeProperty('height');
        product.style.removeProperty('--desktop-phone-scroll-range');
        return;
      }

      const topHeight = topLine?.offsetHeight || 0;
      const availableHeight = Math.max(1, screen.clientHeight - topHeight - 10);
      const homeShift = Math.max(0, scrollContent.scrollHeight - availableHeight);

      /*
        Give the Home screen enough real page distance to reach its final item,
        while preserving additional time for the calendar and client/club
        transitions before the composition is released.
      */
      const scrollRange = Math.max(980, Math.round(homeShift * 3.2 + 520));
      const stageHeight = Math.max(1, stage.offsetHeight);
      const productHeight = stageHeight + scrollRange;

      product.style.height = `${productHeight}px`;
      product.style.setProperty('--desktop-phone-scroll-range', `${scrollRange}px`);
    };

    const requestMeasure = () => {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(measure);
    };

    window.addEventListener('resize', requestMeasure, { passive: true });
    desktopQuery.addEventListener?.('change', requestMeasure);

    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(requestMeasure);
      observer.observe(stage);
      observer.observe(screen);
      observer.observe(scrollContent);
    }

    requestMeasure();
    return true;
  };

  const boot = () => {
    if (install()) return;
    let attempts = 0;
    const waitForHero = () => {
      attempts += 1;
      if (install() || attempts > 240) return;
      requestAnimationFrame(waitForHero);
    };
    requestAnimationFrame(waitForHero);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
