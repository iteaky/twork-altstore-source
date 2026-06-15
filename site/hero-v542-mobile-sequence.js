(() => {
  const clamp = value => Math.max(0, Math.min(1, value));
  const smoothstep = value => value * value * (3 - 2 * value);
  const segment = (value, start, end) => smoothstep(clamp((value - start) / Math.max(0.001, end - start)));
  const mobileQuery = window.matchMedia('(max-width:680px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const LOGICAL_SCREEN_WIDTH = 284;

  const setScreenState = (screen, opacity, y, scale) => {
    const visible = opacity > 0.004;
    screen.style.opacity = String(opacity);
    screen.style.visibility = visible ? 'visible' : 'hidden';
    screen.style.transform = `translate3d(0, ${Math.round(y)}px, 0) scale(${scale})`;
    screen.setAttribute('aria-hidden', opacity >= 0.5 ? 'false' : 'true');
  };

  const normalizeCalendarClone = screen => {
    const grid = screen.querySelector('.hero-cal-grid');
    grid?.classList.remove('is-week-mode');

    screen.querySelectorAll('.hero-cal-week-row').forEach(row => {
      row.style.removeProperty('height');
      row.style.removeProperty('opacity');
      row.style.removeProperty('transform');
      row.style.removeProperty('visibility');
    });

    const collapse = screen.querySelector('.hero-cal-collapse');
    collapse?.style.removeProperty('height');
    collapse?.style.removeProperty('opacity');

    const timeline = screen.querySelector('.hero-cal-timeline');
    timeline?.style.removeProperty('height');

    const content = screen.querySelector('.hero-cal-timeline-content');
    if (content) content.style.transform = 'translate3d(0,0,0)';

    const thumb = screen.querySelector('.hero-cal-timeline-thumb');
    if (thumb) thumb.style.transform = 'translateY(0)';
  };

  const wrapScreenContents = (screen, className) => {
    const existing = screen.querySelector(':scope > .hero-mobile-ui-canvas');
    if (existing) return existing;

    const canvas = document.createElement('div');
    canvas.className = `hero-mobile-ui-canvas ${className}`;
    [...screen.children].forEach(child => canvas.appendChild(child));
    screen.appendChild(canvas);
    return canvas;
  };

  const sizeCanvas = (screen, canvas) => {
    if (!mobileQuery.matches) {
      canvas.style.removeProperty('width');
      canvas.style.removeProperty('height');
      canvas.style.removeProperty('transform');
      return 1;
    }

    const screenWidth = Math.max(1, screen.clientWidth);
    const screenHeight = Math.max(1, screen.clientHeight);
    const scale = screenWidth / LOGICAL_SCREEN_WIDTH;
    const logicalHeight = screenHeight / scale;

    canvas.style.width = `${LOGICAL_SCREEN_WIDTH}px`;
    canvas.style.height = `${logicalHeight}px`;
    canvas.style.transform = `scale(${scale})`;
    return scale;
  };

  const install = () => {
    const product = document.querySelector('#product');
    const stage = product?.querySelector('.hero-phone-stage');
    const mainFrame = product?.querySelector('.device-main .device-frame');
    const homeScreen = mainFrame?.querySelector('.real-home-preview');
    const sourceCalendarScreen = product?.querySelector('.device-calendar .hero-calendar-screen');
    const sourceClientScreen = product?.querySelector('.device-client .hero-client-screen');
    const sourceClubScreen = product?.querySelector('.device-client .hero-club-screen');

    if (!product || !stage || !mainFrame || !homeScreen || !sourceCalendarScreen || !sourceClientScreen || !sourceClubScreen) {
      return false;
    }
    if (product.dataset.mobileSequenceReady === 'true') return true;
    product.dataset.mobileSequenceReady = 'true';

    const mobileCalendarScreen = sourceCalendarScreen.cloneNode(true);
    mobileCalendarScreen.classList.add('hero-mobile-calendar-screen');
    mobileCalendarScreen.removeAttribute('style');
    mobileCalendarScreen.setAttribute('aria-hidden', 'true');
    normalizeCalendarClone(mobileCalendarScreen);

    const mobileClientScreen = sourceClientScreen.cloneNode(true);
    mobileClientScreen.classList.add('hero-mobile-client-screen');
    mobileClientScreen.removeAttribute('style');
    mobileClientScreen.setAttribute('aria-hidden', 'true');

    const mobileClubScreen = sourceClubScreen.cloneNode(true);
    mobileClubScreen.classList.add('hero-mobile-club-screen');
    mobileClubScreen.removeAttribute('style');
    mobileClubScreen.setAttribute('aria-hidden', 'true');

    mainFrame.append(mobileCalendarScreen, mobileClientScreen, mobileClubScreen);

    const homeCanvas = wrapScreenContents(homeScreen, 'hero-home-canvas');
    const calendarCanvas = wrapScreenContents(mobileCalendarScreen, 'hero-calendar-canvas');
    const clientCanvas = wrapScreenContents(mobileClientScreen, 'hero-client-canvas');
    const clubCanvas = wrapScreenContents(mobileClubScreen, 'hero-club-canvas');

    const homeTopLine = homeScreen.querySelector('.real-app-topline');
    const homeContent = homeScreen.querySelector('.real-home-scroll-content');
    const homeTrack = homeScreen.querySelector('.hero-screen-scroll-track');
    const homeThumb = homeTrack?.querySelector('.hero-screen-scroll-thumb');

    const calendarGrid = mobileCalendarScreen.querySelector('.hero-cal-grid');
    const calendarRows = [...mobileCalendarScreen.querySelectorAll('.hero-cal-week-row')];
    const selectedWeek = mobileCalendarScreen.querySelector('.hero-cal-week-row.selected-week');
    const selectedWeekIndex = Math.max(0, calendarRows.indexOf(selectedWeek));
    const collapseHandle = mobileCalendarScreen.querySelector('.hero-cal-collapse');
    const calendarTimeline = mobileCalendarScreen.querySelector('.hero-cal-timeline');
    const calendarTimelineContent = mobileCalendarScreen.querySelector('.hero-cal-timeline-content');
    const calendarTimelineTrack = mobileCalendarScreen.querySelector('.hero-cal-timeline-track');
    const calendarTimelineThumb = mobileCalendarScreen.querySelector('.hero-cal-timeline-thumb');

    let frameRequested = false;

    const updateCanvases = () => {
      sizeCanvas(homeScreen, homeCanvas);
      sizeCanvas(mobileCalendarScreen, calendarCanvas);
      sizeCanvas(mobileClientScreen, clientCanvas);
      sizeCanvas(mobileClubScreen, clubCanvas);
    };

    const resetDesktop = () => {
      updateCanvases();
      homeScreen.style.opacity = '1';
      homeScreen.style.visibility = 'visible';
      homeScreen.style.transform = 'none';
      mobileCalendarScreen.style.opacity = '0';
      mobileCalendarScreen.style.visibility = 'hidden';
      mobileClientScreen.style.opacity = '0';
      mobileClientScreen.style.visibility = 'hidden';
      mobileClubScreen.style.opacity = '0';
      mobileClubScreen.style.visibility = 'hidden';
      homeScreen.setAttribute('aria-hidden', 'false');
      mobileCalendarScreen.setAttribute('aria-hidden', 'true');
      mobileClientScreen.setAttribute('aria-hidden', 'true');
      mobileClubScreen.setAttribute('aria-hidden', 'true');
      if (homeTrack) homeTrack.style.removeProperty('opacity');
    };

    const updateHomeScroll = progress => {
      if (!homeContent) return;

      const topHeight = homeTopLine?.offsetHeight || 0;
      const availableHeight = Math.max(1, homeCanvas.clientHeight - topHeight - 8);
      const maxShift = Math.max(0, homeContent.scrollHeight - availableHeight);
      const shift = Math.round(maxShift * progress);
      homeContent.style.transform = `translate3d(0, ${-shift}px, 0)`;

      if (!homeTrack || !homeThumb) return;
      const trackHeight = homeTrack.clientHeight;
      const ratio = Math.min(1, availableHeight / Math.max(availableHeight, homeContent.scrollHeight));
      const thumbHeight = Math.max(30, Math.round(trackHeight * ratio));
      const thumbTravel = Math.max(0, trackHeight - thumbHeight);
      homeThumb.style.height = `${thumbHeight}px`;
      homeThumb.style.transform = `translateY(${Math.round(thumbTravel * progress)}px)`;
      homeTrack.style.opacity = maxShift > 3 ? '.72' : '0';
    };

    const updateCalendarScroll = progress => {
      if (!calendarGrid || calendarRows.length < 2) return;

      const rowHeight = selectedWeek?.offsetHeight || 40;
      const collapseProgress = segment(progress, 0, 0.48);

      calendarRows.forEach((row, index) => {
        const isSelected = index === selectedWeekIndex;
        const remaining = isSelected ? 1 : 1 - collapseProgress;
        row.style.height = `${Math.max(0, Math.round(rowHeight * remaining))}px`;
        row.style.opacity = isSelected ? '1' : String(Math.max(0, remaining));
        row.style.transform = isSelected
          ? 'translate3d(0,0,0) scaleY(1)'
          : `translate3d(0,${(index < selectedWeekIndex ? 3 : -3) * collapseProgress}px,0) scaleY(${0.92 + 0.08 * remaining})`;
        row.style.visibility = !isSelected && collapseProgress > 0.995 ? 'hidden' : 'visible';
      });
      calendarGrid.classList.toggle('is-week-mode', collapseProgress > 0.98);

      if (collapseHandle) {
        collapseHandle.style.height = `${Math.round(14 - 6 * collapseProgress)}px`;
        collapseHandle.style.opacity = String(1 - 0.45 * collapseProgress);
      }

      if (!calendarTimeline || !calendarTimelineContent || !calendarTimelineTrack || !calendarTimelineThumb) return;

      const baseHeight = 185;
      const hiddenWeekCount = Math.max(0, calendarRows.length - 1);
      const expandedHeight = baseHeight + Math.max(0, rowHeight * hiddenWeekCount - 18);
      calendarTimeline.style.height = `${Math.round(baseHeight + (expandedHeight - baseHeight) * collapseProgress)}px`;

      const timelineProgress = segment(progress, 0.28, 1);
      const timelineMaxShift = Math.max(0, calendarTimelineContent.scrollHeight - calendarTimeline.clientHeight);
      calendarTimelineContent.style.transform = `translate3d(0, ${-Math.round(timelineMaxShift * timelineProgress)}px, 0)`;

      const trackHeight = calendarTimelineTrack.clientHeight;
      const ratio = Math.min(1, calendarTimeline.clientHeight / Math.max(calendarTimeline.clientHeight, calendarTimelineContent.scrollHeight));
      const thumbHeight = Math.max(24, Math.round(trackHeight * ratio));
      const thumbTravel = Math.max(0, trackHeight - thumbHeight);
      calendarTimelineThumb.style.height = `${thumbHeight}px`;
      calendarTimelineThumb.style.transform = `translateY(${Math.round(thumbTravel * timelineProgress)}px)`;
      calendarTimelineTrack.style.opacity = timelineMaxShift > 3 ? '.72' : '0';
    };

    const update = () => {
      frameRequested = false;

      if (!mobileQuery.matches) {
        resetDesktop();
        return;
      }

      updateCanvases();

      const rect = product.getBoundingClientRect();
      const pageTop = window.scrollY + rect.top;
      const stickyTop = Number.parseFloat(getComputedStyle(stage).top) || 0;
      const scrollRange = Math.max(1, product.offsetHeight - stage.offsetHeight);
      const progress = clamp((window.scrollY - (pageTop - stickyTop)) / scrollRange);

      /*
        0.00–0.21  Home screen scrolls internally.
        0.23–0.29  Home changes to calendar.
        0.29–0.57  Calendar collapses month-to-week and scrolls the timeline.
        0.59–0.65  Calendar changes to client dashboard.
        0.65–0.76  Client dashboard remains visible.
        0.76–0.82  Client changes to club dashboard.
        0.82–1.00  Club dashboard remains visible before the page continues.
      */
      const homeScrollProgress = segment(progress, 0.00, 0.21);
      const calendarScrollProgress = segment(progress, 0.29, 0.57);
      const homeToCalendar = reduceMotion.matches
        ? (progress >= 0.26 ? 1 : 0)
        : segment(progress, 0.23, 0.29);
      const calendarToClient = reduceMotion.matches
        ? (progress >= 0.62 ? 1 : 0)
        : segment(progress, 0.59, 0.65);
      const clientToClub = reduceMotion.matches
        ? (progress >= 0.79 ? 1 : 0)
        : segment(progress, 0.76, 0.82);

      updateHomeScroll(homeScrollProgress);
      updateCalendarScroll(calendarScrollProgress);

      const homeOpacity = 1 - homeToCalendar;
      const calendarOpacity = homeToCalendar * (1 - calendarToClient);
      const clientOpacity = calendarToClient * (1 - clientToClub);
      const clubOpacity = clientToClub;

      setScreenState(homeScreen, homeOpacity, -8 * homeToCalendar, 1 - 0.012 * homeToCalendar);
      setScreenState(
        mobileCalendarScreen,
        calendarOpacity,
        12 * (1 - homeToCalendar) - 8 * calendarToClient,
        0.988 + 0.012 * homeToCalendar - 0.012 * calendarToClient
      );
      setScreenState(
        mobileClientScreen,
        clientOpacity,
        12 * (1 - calendarToClient) - 8 * clientToClub,
        0.988 + 0.012 * calendarToClient - 0.012 * clientToClub
      );
      setScreenState(mobileClubScreen, clubOpacity, 12 * (1 - clientToClub), 0.988 + 0.012 * clientToClub);

      if (homeTrack) homeTrack.style.opacity = String(Math.max(0, 0.72 * homeOpacity));

      product.style.setProperty('--mobile-home-progress', homeOpacity.toFixed(4));
      product.style.setProperty('--mobile-calendar-progress', calendarOpacity.toFixed(4));
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
      observer.observe(homeScreen);
      observer.observe(mobileCalendarScreen);
      observer.observe(mobileClientScreen);
      observer.observe(mobileClubScreen);
    }

    requestUpdate();
    return true;
  };

  const boot = () => {
    if (install()) return;
    let attempts = 0;
    const waitForHero = () => {
      attempts += 1;
      if (install() || attempts > 300) return;
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
