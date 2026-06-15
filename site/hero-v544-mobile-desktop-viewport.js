(() => {
  const mobileQuery = window.matchMedia('(max-width:680px)');
  const BASE_PHONE_WIDTH = 302;
  const BASE_PHONE_HEIGHT = 655;

  const applyScale = () => {
    const product = document.querySelector('#product.hero-scroll-product');
    if (!product) return;

    if (!mobileQuery.matches) {
      product.style.removeProperty('--twork-mobile-phone-scale');
      return;
    }

    const viewportWidth = Math.max(320, window.innerWidth);
    const viewportHeight = Math.max(
      480,
      window.visualViewport?.height || window.innerHeight
    );

    /* Scale the exact desktop 302 × 655 phone as one object. */
    const widthScale = (viewportWidth * 0.94) / BASE_PHONE_WIDTH;
    const heightScale = (viewportHeight - 92) / BASE_PHONE_HEIGHT;
    const scale = Math.max(0.86, Math.min(widthScale, heightScale, 1.34));

    product.style.setProperty('--twork-mobile-phone-scale', scale.toFixed(4));
  };

  const boot = () => {
    applyScale();
    window.addEventListener('resize', applyScale, { passive: true });
    window.visualViewport?.addEventListener('resize', applyScale, { passive: true });
    mobileQuery.addEventListener?.('change', applyScale);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
