(() => {
  const clamp = value => Math.max(0, Math.min(1, value));
  const smoothstep = value => value * value * (3 - 2 * value);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const statusMarkup = `
    <span class="hero-status-icons" aria-label="Связь, Wi-Fi, батарея">
      <span class="hero-signal" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="hero-wifi" aria-hidden="true"></span>
      <span class="hero-battery" aria-hidden="true"></span>
    </span>`;

  const clubScreenMarkup = `
    <div class="hero-club-status"><span>9:41</span>${statusMarkup}</div>
    <div class="hero-club-nav"><span class="hero-club-back">‹</span><span></span><span>•••</span></div>
    <section class="hero-club-hero">
      <span class="hero-club-type">Активен</span>
      <h3 class="hero-club-name">Iron Club</h3>
      <div class="hero-club-meta">
        <span><i>●</i>Ольга · администратор</span>
        <span><i>⌕</i>+421 905 123 456</span>
        <span><i>◉</i>Telegram</span>
      </div>
      <div class="hero-club-actions"><span>Написать</span><span>Позвонить</span><span>Изменить</span></div>
    </section>
    <div class="hero-club-grid">
      <section class="hero-club-card">
        <div class="hero-club-card-head"><i>▣</i><b>К выплате</b><span>История</span></div>
        <div class="hero-club-value positive"><strong>€ 1 140</strong><small>Клуб должен вам</small></div>
        <div class="hero-club-balance-actions"><span>Рассчитаться</span><span>Оплатить клубу</span></div>
      </section>
      <section class="hero-club-card">
        <div class="hero-club-card-head"><i>◷</i><b>План заработка</b><span>Все</span></div>
        <div class="hero-club-value"><strong>€ 420</strong><small>Будущие тренировки, услуги и дежурства</small></div>
        <div class="hero-club-card-footer">Открыть план</div>
      </section>
      <section class="hero-club-card compact">
        <div class="hero-club-card-head"><i>♟</i><b>Клиенты клуба</b></div>
        <div class="hero-club-count"><strong>18</strong><small>закреплено за клубом</small></div>
        <div class="hero-club-card-footer">Новый клиент</div>
      </section>
      <section class="hero-club-card compact">
        <div class="hero-club-card-head"><i>◷</i><b>Ближайшие групповые</b><span>Все</span></div>
        <div class="hero-club-list">
          <div><b>18 июня · 19:00</b><small>Functional · 8 участников</small></div>
          <div><b>20 июня · 10:00</b><small>Mobility · 6 участников</small></div>
        </div>
        <div class="hero-club-card-footer">Добавить тренировку</div>
      </section>
      <section class="hero-club-card compact duty">
        <div class="hero-club-card-head"><i>━</i><b>Дежурство</b><span>Все</span></div>
        <div class="hero-club-list">
          <div><b>22 июня · 15:00–18:00</b><small>Iron Club · фикс за смену</small></div>
          <div><b>29 июня · 15:00–18:00</b><small>Запланировано</small></div>
        </div>
        <div class="hero-club-card-footer">Добавить дежурство</div>
      </section>
      <section class="hero-club-card compact">
        <div class="hero-club-card-head"><i>€</i><b>Следующая оплата</b></div>
        <div class="hero-club-value"><strong>€ 180</strong><small>1 июля · аренда за месяц</small></div>
        <div class="hero-club-card-footer">Будущие оплаты</div>
      </section>
    </div>`;

  const install = () => {
    const product = document.querySelector('#product');
    const stage = product?.querySelector('.hero-phone-stage');
    const rightDevice = product?.querySelector('.device-client');
    const frame = rightDevice?.querySelector('.device-frame');
    const clientScreen = frame?.querySelector('.hero-client-screen');

    if (!product || !stage || !frame || !clientScreen) return false;
    if (product.dataset.clubScreenReady === 'true') return true;
    product.dataset.clubScreenReady = 'true';
    product.classList.add('hero-club-switch-ready');

    const clubScreen = document.createElement('div');
    clubScreen.className = 'app-screen hero-club-screen';
    clubScreen.setAttribute('aria-hidden', 'true');
    clubScreen.innerHTML = clubScreenMarkup;
    frame.appendChild(clubScreen);

    const floatingCard = product.querySelector('.floating-card-right');
    const floatingLabel = floatingCard?.querySelector('.mini-label');
    const floatingValue = floatingCard?.querySelector('strong');
    const floatingHint = floatingCard?.querySelector('small');
    const originalFloating = floatingCard ? {
      label: floatingLabel?.textContent || '',
      value: floatingValue?.textContent || '',
      hint: floatingHint?.textContent || ''
    } : null;
    let floatingShowsClub = false;

    let frameRequested = false;
    const update = () => {
      frameRequested = false;
      const rect = product.getBoundingClientRect();
      const pageTop = window.scrollY + rect.top;
      const stickyTop = Number.parseFloat(getComputedStyle(stage).top) || 0;
      const scrollRange = Math.max(1, product.offsetHeight - stage.offsetHeight);
      const pageProgress = clamp((window.scrollY - (pageTop - stickyTop)) / scrollRange);
      const rawClubProgress = clamp((pageProgress - 0.28) / 0.38);
      const clubProgress = reduceMotion.matches
        ? (rawClubProgress >= 0.5 ? 1 : 0)
        : smoothstep(rawClubProgress);

      clientScreen.style.opacity = String(1 - clubProgress);
      clientScreen.style.transform = `translate3d(0, ${Math.round(-8 * clubProgress)}px, 0) scale(${1 - 0.012 * clubProgress})`;
      clubScreen.style.opacity = String(clubProgress);
      clubScreen.style.transform = `translate3d(0, ${Math.round(12 * (1 - clubProgress))}px, 0) scale(${0.988 + 0.012 * clubProgress})`;
      clientScreen.style.visibility = clubProgress > 0.995 ? 'hidden' : 'visible';
      clubScreen.style.visibility = clubProgress < 0.005 ? 'hidden' : 'visible';
      product.style.setProperty('--club-screen-progress', clubProgress.toFixed(4));

      const shouldShowClub = clubProgress >= 0.52;
      if (floatingCard && originalFloating && shouldShowClub !== floatingShowsClub) {
        floatingShowsClub = shouldShowClub;
        floatingCard.animate(
          [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(5px)' }],
          { duration: reduceMotion.matches ? 0 : 130, easing: 'ease-out' }
        ).finished.catch(() => {}).then(() => {
          if (!floatingLabel || !floatingValue || !floatingHint) return;
          if (floatingShowsClub) {
            floatingLabel.textContent = 'Баланс клуба';
            floatingValue.textContent = '€ 1 140';
            floatingHint.textContent = 'К получению после удержаний';
          } else {
            floatingLabel.textContent = originalFloating.label;
            floatingValue.textContent = originalFloating.value;
            floatingHint.textContent = originalFloating.hint;
          }
          floatingCard.animate(
            [{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: reduceMotion.matches ? 0 : 150, easing: 'ease-out' }
          );
        });
      }
    };

    const requestUpdate = () => {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
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
    const waitForPreparedHero = () => {
      attempts += 1;
      if (install() || attempts > 180) return;
      requestAnimationFrame(waitForPreparedHero);
    };
    requestAnimationFrame(waitForPreparedHero);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
