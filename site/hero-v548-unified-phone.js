(() => {
  const mobileQuery = window.matchMedia('(max-width:680px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const smoothstep = value => value * value * (3 - 2 * value);
  const segment = (value, start, end) => smoothstep(clamp((value - start) / Math.max(0.001, end - start)));
  const PHONE_WIDTH = 302;
  const PHONE_HEIGHT = 655;
  const CALENDAR_ROW_HEIGHT = 45;
  const CALENDAR_TIMELINE_BASE_HEIGHT = 214;

  const setScreenState = (screen, opacity, y, scale) => {
    const visible = opacity > 0.004;
    screen.style.opacity = opacity.toFixed(4);
    screen.style.visibility = visible ? 'visible' : 'hidden';
    screen.style.transform = `translate3d(0,${Math.round(y)}px,0) scale(${scale.toFixed(4)})`;
    screen.style.pointerEvents = opacity > 0.995 ? 'auto' : 'none';
    screen.setAttribute('aria-hidden', opacity >= 0.5 ? 'false' : 'true');
  };

  const normalizeCalendar = screen => {
    screen.querySelector('.hero-cal-grid')?.classList.remove('is-week-mode');
    screen.querySelectorAll('.hero-cal-week-row').forEach(row => {
      row.style.removeProperty('height');
      row.style.removeProperty('min-height');
      row.style.removeProperty('opacity');
      row.style.removeProperty('transform');
      row.style.removeProperty('visibility');
    });
    const collapse = screen.querySelector('.hero-cal-collapse');
    collapse?.style.removeProperty('height');
    collapse?.style.removeProperty('opacity');
    screen.querySelector('.hero-cal-timeline')?.style.removeProperty('height');
    const content = screen.querySelector('.hero-cal-timeline-content');
    if (content) content.style.transform = 'translate3d(0,0,0)';
    const thumb = screen.querySelector('.hero-cal-timeline-thumb');
    if (thumb) thumb.style.transform = 'translateY(0)';
  };

  const unwrapLegacyCanvas = screen => {
    const canvas = screen.querySelector(':scope > .hero-mobile-ui-canvas');
    if (!canvas) return;
    while (canvas.firstChild) screen.insertBefore(canvas.firstChild, canvas);
    canvas.remove();
  };

  const isolateHomeFromLegacyController = homeScreen => {
    const isolated = homeScreen.cloneNode(true);
    isolated.removeAttribute('style');
    isolated.querySelector('.real-home-scroll-content')?.style.removeProperty('transform');
    const track = isolated.querySelector('.hero-screen-scroll-track');
    track?.style.removeProperty('opacity');
    const thumb = track?.querySelector('.hero-screen-scroll-thumb');
    thumb?.style.removeProperty('height');
    thumb?.style.removeProperty('transform');
    homeScreen.replaceWith(isolated);
    return isolated;
  };

  const install = () => {
    const product = document.querySelector('#product.hero-scroll-product');
    const stage = product?.querySelector('.hero-phone-stage');
    const mainFrame = product?.querySelector('.device-main .device-frame');
    let homeScreen = mainFrame?.querySelector('.real-home-preview');
    const calendarSource = product?.querySelector('.device-calendar .hero-calendar-screen');
    const clientSource = product?.querySelector('.device-client .hero-client-screen');
    const clubSource = product?.querySelector('.device-client .hero-club-screen');

    if (!product || !stage || !mainFrame || !homeScreen || !calendarSource || !clientSource || !clubSource) return false;
    if (!calendarSource.querySelector('.hero-cal-week-row')) return false;
    if (product.dataset.unifiedPhoneReady === 'true') return true;
    product.dataset.unifiedPhoneReady = 'true';

    unwrapLegacyCanvas(homeScreen);
    mainFrame.querySelectorAll(
      '.hero-mobile-calendar-screen,.hero-mobile-client-screen,.hero-mobile-club-screen,.hero-unified-calendar-screen,.hero-unified-client-screen,.hero-unified-club-screen'
    ).forEach(screen => screen.remove());

    homeScreen = isolateHomeFromLegacyController(homeScreen);

    const calendarScreen = calendarSource.cloneNode(true);
    calendarScreen.classList.add('hero-unified-calendar-screen');
    calendarScreen.removeAttribute('style');
    normalizeCalendar(calendarScreen);

    const clientScreen = clientSource.cloneNode(true);
    clientScreen.classList.add('hero-unified-client-screen');
    clientScreen.removeAttribute('style');

    const clubScreen = clubSource.cloneNode(true);
    clubScreen.classList.add('hero-unified-club-screen');
    clubScreen.removeAttribute('style');

    mainFrame.append(calendarScreen, clientScreen, clubScreen);

    const homeTopLine = homeScreen.querySelector('.real-app-topline');
    const homeContent = homeScreen.querySelector('.real-home-scroll-content');
    const homeTrack = homeScreen.querySelector('.hero-screen-scroll-track');
    const homeThumb = homeTrack?.querySelector('.hero-screen-scroll-thumb');

    const calendarGrid = calendarScreen.querySelector('.hero-cal-grid');
    const calendarRows = [...calendarScreen.querySelectorAll('.hero-cal-week-row')];
    const selectedWeek = calendarScreen.querySelector('.hero-cal-week-row.selected-week');
    const selectedWeekIndex = Math.max(0, calendarRows.indexOf(selectedWeek));
    const collapseHandle = calendarScreen.querySelector('.hero-cal-collapse');
    const calendarTimeline = calendarScreen.querySelector('.hero-cal-timeline');
    const calendarTimelineContent = calendarScreen.querySelector('.hero-cal-timeline-content');
    const calendarTimelineTrack = calendarScreen.querySelector('.hero-cal-timeline-track');
    const calendarTimelineThumb = calendarScreen.querySelector('.hero-cal-timeline-thumb');

    if (!homeContent || !calendarGrid || calendarRows.length < 2 || !selectedWeek) return false;

    let frameRequested = false;
    let lockedViewportHeight = Math.round(window.visualViewport?.height || window.innerHeight);
    let lastLayoutWidth = Math.round(document.documentElement.clientWidth || window.innerWidth);
    let productTop = 0;
    let pinEnd = 1;
    let pinState = '';

    let homeAvailableHeight = 1;
    let homeMaxShift = 0;
    let homeThumbHeight = 30;
    let homeThumbTravel = 0;

    let timelineContentHeight = 408;
    let timelineTrackInset = 16;

    const setPinState = nextState => {
      if (pinState === nextState) return;
      pinState = nextState;
      product.classList.toggle('twork-phone-pinned', nextState === 'pinned');
      product.classList.toggle('twork-phone-ended', nextState === 'ended');
    };

    const clearPinClasses = () => setPinState('before');

    const applyStableGeometry = force => {
      if (!mobileQuery.matches) {
        product.style.removeProperty('--twork-unified-phone-scale');
        product.style.removeProperty('--twork-unified-stage-height');
        clearPinClasses();
        return;
      }

      const layoutWidth = Math.round(document.documentElement.clientWidth || window.innerWidth);
      const widthChanged = Math.abs(layoutWidth - lastLayoutWidth) > 6;
      if (!force && !widthChanged) return;

      lastLayoutWidth = layoutWidth;
      if (force) lockedViewportHeight = Math.round(window.visualViewport?.height || window.innerHeight);

      const widthScale = Math.max(0.1, (layoutWidth - 4) / PHONE_WIDTH);
      const heightScale = Math.max(0.1, (lockedViewportHeight - 92) / PHONE_HEIGHT);
      const scale = Math.max(0.84, Math.min(widthScale, heightScale, 1.34));

      product.style.setProperty('--twork-unified-stage-height', `${lockedViewportHeight}px`);
      product.style.setProperty('--twork-unified-phone-scale', scale.toFixed(4));
    };

    const measureStaticMetrics = () => {
      const topHeight = homeTopLine?.offsetHeight || 0;
      homeAvailableHeight = Math.max(1, homeScreen.clientHeight - topHeight - 10);
      homeMaxShift = Math.max(0, homeContent.scrollHeight - homeAvailableHeight);

      if (homeTrack && homeThumb) {
        const trackHeight = homeTrack.clientHeight;
        const ratio = Math.min(1, homeAvailableHeight / Math.max(homeAvailableHeight, homeContent.scrollHeight));
        homeThumbHeight = Math.max(30, Math.round(trackHeight * ratio));
        homeThumbTravel = Math.max(0, trackHeight - homeThumbHeight);
      }

      if (calendarTimelineContent) {
        timelineContentHeight = Math.max(408, calendarTimelineContent.scrollHeight);
      }
      if (calendarTimeline && calendarTimelineTrack) {
        const trackStyle = getComputedStyle(calendarTimelineTrack);
        const topInset = Number.parseFloat(trackStyle.top) || 0;
        const bottomInset = Number.parseFloat(trackStyle.bottom) || 0;
        timelineTrackInset = Math.max(0, topInset + bottomInset);
      }
    };

    const measurePinBounds = () => {
      const rect = product.getBoundingClientRect();
      productTop = Math.round(window.scrollY + rect.top);
      pinEnd = Math.max(productTop + 1, productTop + product.offsetHeight - lockedViewportHeight);
    };

    const applyPinState = scrollY => {
      if (scrollY < productTop) {
        setPinState('before');
      } else if (scrollY >= pinEnd) {
        setPinState('ended');
      } else {
        setPinState('pinned');
      }
    };

    const updateHome = progress => {
      const shift = Math.round(homeMaxShift * progress);
      homeContent.style.transform = `translate3d(0,${-shift}px,0)`;

      if (!homeTrack || !homeThumb) return;
      homeThumb.style.height = `${homeThumbHeight}px`;
      homeThumb.style.transform = `translateY(${Math.round(homeThumbTravel * progress)}px)`;
      homeTrack.style.opacity = homeMaxShift > 3 ? '.72' : '0';
    };

    const updateCalendar = progress => {
      const collapseProgress = smoothstep(clamp(progress / 0.34));

      calendarRows.forEach((row, index) => {
        const isSelected = index === selectedWeekIndex;
        const remaining = isSelected ? 1 : 1 - collapseProgress;
        row.style.height = `${Math.max(0, CALENDAR_ROW_HEIGHT * remaining).toFixed(2)}px`;
        row.style.minHeight = '0px';
        row.style.opacity = isSelected ? '1' : remaining.toFixed(4);
        row.style.transform = isSelected
          ? 'translate3d(0,0,0) scaleY(1)'
          : `translate3d(0,${Math.round((index < selectedWeekIndex ? 3 : -3) * collapseProgress)}px,0) scaleY(${(0.92 + 0.08 * remaining).toFixed(4)})`;
        row.style.visibility = !isSelected && collapseProgress > 0.995 ? 'hidden' : 'visible';
      });
      calendarGrid.classList.toggle('is-week-mode', collapseProgress > 0.98);

      if (collapseHandle) {
        collapseHandle.style.height = `${(14 - 6 * collapseProgress).toFixed(2)}px`;
        collapseHandle.style.opacity = (1 - 0.45 * collapseProgress).toFixed(4);
      }

      if (!calendarTimeline || !calendarTimelineContent || !calendarTimelineTrack || !calendarTimelineThumb) return;

      const hiddenWeekCount = Math.max(0, calendarRows.length - 1);
      const expandedHeight = CALENDAR_TIMELINE_BASE_HEIGHT + Math.max(0, CALENDAR_ROW_HEIGHT * hiddenWeekCount - 18);
      const timelineHeight = CALENDAR_TIMELINE_BASE_HEIGHT +
        (expandedHeight - CALENDAR_TIMELINE_BASE_HEIGHT) * collapseProgress;
      calendarTimeline.style.height = `${timelineHeight.toFixed(2)}px`;

      const timelineProgress = smoothstep(clamp((progress - 0.16) / 0.84));
      const timelineMaxShift = Math.max(0, timelineContentHeight - timelineHeight);
      calendarTimelineContent.style.transform = `translate3d(0,${-Math.round(timelineMaxShift * timelineProgress)}px,0)`;

      const trackHeight = Math.max(1, timelineHeight - timelineTrackInset);
      const ratio = Math.min(1, timelineHeight / Math.max(timelineHeight, timelineContentHeight));
      const thumbHeight = Math.max(24, Math.round(trackHeight * ratio));
      const thumbTravel = Math.max(0, trackHeight - thumbHeight);
      calendarTimelineThumb.style.height = `${thumbHeight}px`;
      calendarTimelineThumb.style.transform = `translateY(${Math.round(thumbTravel * timelineProgress)}px)`;
      calendarTimelineTrack.style.opacity = timelineMaxShift > 3 ? '.72' : '0';
    };

    const resetDesktopCloneState = () => {
      clearPinClasses();
      [calendarScreen, clientScreen, clubScreen].forEach(screen => {
        screen.style.opacity = '0';
        screen.style.visibility = 'hidden';
        screen.style.pointerEvents = 'none';
        screen.setAttribute('aria-hidden', 'true');
      });
      homeScreen.style.opacity = '1';
      homeScreen.style.visibility = 'visible';
      homeScreen.style.transform = 'none';
      homeScreen.style.pointerEvents = 'auto';
      homeScreen.setAttribute('aria-hidden', 'false');
    };

    const update = () => {
      frameRequested = false;
      if (!mobileQuery.matches) {
        resetDesktopCloneState();
        return;
      }

      const scrollY = Math.round(window.scrollY);
      applyPinState(scrollY);
      const progress = clamp((scrollY - productTop) / Math.max(1, pinEnd - productTop));

      const homeScrollProgress = segment(progress, 0.00, 0.21);
      const calendarScrollProgress = clamp((progress - 0.29) / (0.57 - 0.29));
      const homeToCalendar = reduceMotion.matches ? (progress >= 0.26 ? 1 : 0) : segment(progress, 0.23, 0.29);
      const calendarToClient = reduceMotion.matches ? (progress >= 0.62 ? 1 : 0) : segment(progress, 0.59, 0.65);
      const clientToClub = reduceMotion.matches ? (progress >= 0.79 ? 1 : 0) : segment(progress, 0.76, 0.82);

      updateHome(homeScrollProgress);
      updateCalendar(calendarScrollProgress);

      const homeOpacity = 1 - homeToCalendar;
      const calendarOpacity = homeToCalendar * (1 - calendarToClient);
      const clientOpacity = calendarToClient * (1 - clientToClub);
      const clubOpacity = clientToClub;

      setScreenState(homeScreen, homeOpacity, -8 * homeToCalendar, 1 - 0.012 * homeToCalendar);
      setScreenState(calendarScreen, calendarOpacity, 12 * (1 - homeToCalendar) - 8 * calendarToClient, 0.988 + 0.012 * homeToCalendar - 0.012 * calendarToClient);
      setScreenState(clientScreen, clientOpacity, 12 * (1 - calendarToClient) - 8 * clientToClub, 0.988 + 0.012 * calendarToClient - 0.012 * clientToClub);
      setScreenState(clubScreen, clubOpacity, 12 * (1 - clientToClub), 0.988 + 0.012 * clientToClub);
    };

    const requestUpdate = () => {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(update);
    };

    const remeasure = forceHeight => {
      if (forceHeight) lockedViewportHeight = Math.round(window.visualViewport?.height || window.innerHeight);
      applyStableGeometry(true);
      requestAnimationFrame(() => {
        measureStaticMetrics();
        measurePinBounds();
        requestUpdate();
      });
    };

    const handleLayoutResize = () => {
      const nextWidth = Math.round(document.documentElement.clientWidth || window.innerWidth);
      if (Math.abs(nextWidth - lastLayoutWidth) <= 6) return;
      lastLayoutWidth = nextWidth;
      remeasure(true);
    };

    const handleOrientationChange = () => {
      window.setTimeout(() => remeasure(true), 180);
    };

    applyStableGeometry(true);
    requestAnimationFrame(() => {
      measureStaticMetrics();
      measurePinBounds();
      requestUpdate();
    });

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', handleLayoutResize, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });
    mobileQuery.addEventListener?.('change', handleOrientationChange);
    reduceMotion.addEventListener?.('change', requestUpdate);

    return true;
  };

  const boot = () => {
    if (install()) return;
    let attempts = 0;
    const waitForDesktopScreens = () => {
      attempts += 1;
      if (install() || attempts > 360) return;
      requestAnimationFrame(waitForDesktopScreens);
    };
    requestAnimationFrame(waitForDesktopScreens);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
