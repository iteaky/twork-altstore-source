(() => {
  const clamp = value => Math.max(0, Math.min(1, value));
  const smoothstep = value => value * value * (3 - 2 * value);
  const mobileQuery = window.matchMedia('(max-width:680px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const install = () => {
    const product = document.querySelector('#product');
    const stage = product?.querySelector('.hero-phone-stage');
    const mainFrame = product?.querySelector('.device-main .device-frame');
    const homeScreen = mainFrame?.querySelector('.real-home-preview');
    const rightClientScreen = product?.querySelector('.device-client .hero-client-screen');
    const rightClubScreen = product?.querySelector('.device-client .hero-club-screen');

    if (!product || !stage || !mainFrame || !homeScreen || !rightClientScreen || !rightClubScreen) return false;
    if (product.dataset.mobileSequenceReady === 'true') return true;
    product.dataset.mobileSequenceReady = 'true';

    const mobileClientScreen = rightClientScreen.cloneNode(true);
    mobileClientScreen.classList.add('hero-mobile-client-screen');
    mobileClientScreen.removeAttribute('style');
    mobileClientScreen.setAttribute('aria-hidden', 'true');

    const mobileClubScreen = rightClubScreen.cloneNode(true);
    mobileClubScreen.classList.add('hero-mobile-club-screen');
    mobileClubScreen.removeAttribute('style');
    mobileClubScreen.setAttribute('aria-hidden', 'true');

    mainFrame.append(mobileClientScreen, mobileClubScreen);

    const screenTrack = homeScreen.querySelector('.hero-screen-scroll-track');
    let frameRequested = false;

    const update = () => {
      frameRequested = false;

      if (!mobileQuery.matches) {
        homeScreen.style.opacity = '1';
        homeScreen.style.visibility = 'visible';
        mobileClientScreen.style.opacity = '0';
        mobileClientScreen.style.visibility = 'hidden';
        mobileClubScreen.style.opacity = '0';
        mobileClubScreen.style.visibility = 'hidden';
        homeScreen.setAttribute('aria-hidden', 'false');
        mobileClientScreen.setAttribute('aria-hidden', 'true');
        mobileClubScreen.setAttribute('aria-hidden', 'true');
        if (screenTrack) screenTrack.style.removeProperty('opacity');
        return;
      }

      const rect = product.getBoundingClientRect();
      const pageTop = window.scrollY + rect.top;
      const stickyTop = Number.parseFloat(getComputedStyle(stage).top) || 0;
      const scrollRange = Math.max(1, product.offsetHeight - stage.offsetHeight);
      const progress = clamp((window.scrollY - (pageTop - stickyTop)) / scrollRange);

      const homeToClientRaw = clamp((progress - 0.18) / 0.20);
      const clientToClubRaw = clamp((progress - 0.58) / 0.20);
      const homeToClient = reduceMotion.matches
        ? (homeToClientRaw >= 0.5 ? 1 : 0)
        : smoothstep(homeToClientRaw);
      const clientToClub = reduceMotion.matches
        ? (clientToClubRaw >= 0.5 ? 1 : 0)
        : smoothstep(clientToClubRaw);

      const homeOpacity = 1 - homeToClient;
      const clientOpacity = homeToClient * (1 - clientToClub);
      const clubOpacity = clientToClub;

      homeScreen.style.opacity = String(homeOpacity);
      homeScreen.style.visibility = homeOpacity < 0.005 ? 'hidden' : 'visible';

      mobileClientScreen.style.opacity = String(clientOpacity);
      mobileClientScreen.style.visibility = clientOpacity < 0.005 ? 'hidden' : 'visible';
      mobileClientScreen.style.transform = `translate3d(0, ${Math.round(12 * (1 - homeToClient) - 8 * clientToClub)}px, 0) scale(${0.988 + 0.012 * homeToClient - 0.012 * clientToClub})`;

      mobileClubScreen.style.opacity = String(clubOpacity);
      mobileClubScreen.style.visibility = clubOpacity < 0.005 ? 'hidden' : 'visible';
      mobileClubScreen.style.transform = `translate3d(0, ${Math.round(12 * (1 - clientToClub))}px, 0) scale(${0.988 + 0.012 * clientToClub})`;

      homeScreen.setAttribute('aria-hidden', homeOpacity < 0.5 ? 'true' : 'false');
      mobileClientScreen.setAttribute('aria-hidden', clientOpacity >= homeOpacity && clientOpacity >= clubOpacity ? 'false' : 'true');
      mobileClubScreen.setAttribute('aria-hidden', clubOpacity > clientOpacity ? 'false' : 'true');

      if (screenTrack) {
        screenTrack.style.opacity = String(Math.max(0, 0.72 * homeOpacity));
      }

      product.style.setProperty('--mobile-home-progress', homeOpacity.toFixed(4));
      product.style.setProperty('--mobile-client-progress', clientOpacity.toFixed(4));
      product.style.setProperty('--mobile-club-progress', clubOpacity.toFixed(4));
    };

    const requestUpdate = () => {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    mobileQuery.addEventListener?.('change', requestUpdate);
    reduceMotion.addEventListener?.('change', requestUpdate);

    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(requestUpdate);
      observer.observe(product);
      observer.observe(stage);
    }

    requestUpdate();
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
