(() => {
  const clamp = value => Math.max(0, Math.min(1, value));

  const statusMarkup = `
    <span class="hero-status-icons" aria-label="Связь, Wi-Fi, батарея">
      <span class="hero-signal" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="hero-wifi" aria-hidden="true"></span>
      <span class="hero-battery" aria-hidden="true"></span>
    </span>`;

  const apply = () => {
    const product = document.querySelector('#product');
    const screen = product?.querySelector('.device-main .real-home-preview');
    if (!product || !screen || product.dataset.scrollPhoneReady === 'true') return;
    product.dataset.scrollPhoneReady = 'true';
    product.classList.add('hero-scroll-product');

    let stage = product.querySelector(':scope > .hero-phone-stage');
    if (!stage) {
      stage = document.createElement('div');
      stage.className = 'hero-phone-stage';
      [...product.children].forEach(child => stage.appendChild(child));
      product.appendChild(stage);
    }

    const topLine = screen.querySelector('.real-app-topline');
    const status = topLine?.lastElementChild;
    if (status) status.outerHTML = statusMarkup;

    product.querySelectorAll('.hero-cal-status > span:last-child, .hero-client-status > span:last-child').forEach(node => {
      node.outerHTML = statusMarkup;
    });

    let scrollContent = screen.querySelector('.real-home-scroll-content');
    if (!scrollContent) {
      scrollContent = document.createElement('div');
      scrollContent.className = 'real-home-scroll-content';
      const fade = screen.querySelector('.real-preview-fade');
      [...screen.children].forEach(child => {
        if (child !== topLine && child !== fade) scrollContent.appendChild(child);
      });
      topLine?.after(scrollContent);
    }

    let track = screen.querySelector('.hero-screen-scroll-track');
    if (!track) {
      track = document.createElement('span');
      track.className = 'hero-screen-scroll-track';
      track.setAttribute('aria-hidden', 'true');
      track.innerHTML = '<i class="hero-screen-scroll-thumb"></i>';
      screen.appendChild(track);
    }
    const thumb = track.querySelector('.hero-screen-scroll-thumb');

    let frameRequested = false;
    const update = () => {
      frameRequested = false;
      const rect = product.getBoundingClientRect();
      const pageTop = window.scrollY + rect.top;
      const stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
      const stageHeight = stage.offsetHeight;
      const scrollRange = Math.max(1, product.offsetHeight - stageHeight);
      const progress = clamp((window.scrollY - (pageTop - stickyTop)) / scrollRange);

      const topHeight = topLine?.offsetHeight || 0;
      const availableHeight = Math.max(1, screen.clientHeight - topHeight - 10);
      const maxShift = Math.max(0, scrollContent.scrollHeight - availableHeight);
      const shift = Math.round(maxShift * progress);
      scrollContent.style.transform = `translate3d(0, ${-shift}px, 0)`;

      const trackHeight = track.clientHeight;
      const ratio = Math.min(1, availableHeight / Math.max(availableHeight, scrollContent.scrollHeight));
      const thumbHeight = Math.max(30, Math.round(trackHeight * ratio));
      const thumbTravel = Math.max(0, trackHeight - thumbHeight);
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.transform = `translateY(${Math.round(thumbTravel * progress)}px)`;
      track.style.opacity = maxShift > 3 ? '.72' : '0';
    };

    const requestUpdate = () => {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    new ResizeObserver(requestUpdate).observe(scrollContent);
    requestUpdate();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
})();
