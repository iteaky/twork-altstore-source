(() => {
  const mobileQuery = window.matchMedia('(max-width:680px)');
  const clamp = value => Math.max(0, Math.min(1, value));
  const smoothstep = value => value * value * (3 - 2 * value);
  const CALENDAR_ROW_HEIGHT = 45;
  const TIMELINE_BASE_HEIGHT = 214;

  const install = () => {
    const product = document.querySelector('#product.hero-scroll-product');
    const stage = product?.querySelector('.hero-phone-stage');
    const screen = product?.querySelector('.device-main .hero-mobile-calendar-screen');
    const grid = screen?.querySelector('.hero-cal-grid');
    const rows = screen ? [...screen.querySelectorAll('.hero-cal-week-row')] : [];
    const selectedWeek = screen?.querySelector('.hero-cal-week-row.selected-week');
    const collapseHandle = screen?.querySelector('.hero-cal-collapse');
    const timeline = screen?.querySelector('.hero-cal-timeline');
    const timelineContent = timeline?.querySelector('.hero-cal-timeline-content');
    const timelineTrack = timeline?.querySelector('.hero-cal-timeline-track');
    const timelineThumb = timeline?.querySelector('.hero-cal-timeline-thumb');

    if (!product || !stage || !screen || !grid || rows.length < 2 || !selectedWeek) return false;
    if (screen.dataset.desktopCollapseReady === 'true') return true;
    screen.dataset.desktopCollapseReady = 'true';

    const selectedWeekIndex = Math.max(0, rows.indexOf(selectedWeek));
    let frameRequested = false;

    const update = () => {
      frameRequested = false;
      if (!mobileQuery.matches) return;

      const rect = product.getBoundingClientRect();
      const pageTop = window.scrollY + rect.top;
      const stickyTop = Number.parseFloat(getComputedStyle(stage).top) || 0;
      const scrollRange = Math.max(1, product.offsetHeight - stage.offsetHeight);
      const pageProgress = clamp((window.scrollY - (pageTop - stickyTop)) / scrollRange);

      /* Same calendar segment and curve as desktop. */
      const calendarSegment = smoothstep(clamp((pageProgress - 0.29) / (0.57 - 0.29)));
      const collapseProgress = smoothstep(clamp(calendarSegment / 0.34));

      rows.forEach((row, index) => {
        const isSelected = index === selectedWeekIndex;
        const remaining = isSelected ? 1 : 1 - collapseProgress;
        const height = Math.max(0, Math.round(CALENDAR_ROW_HEIGHT * remaining));

        /* Another legacy listener still calculates the old mobile animation.
           Use important inline values so both controllers cannot fight each
           other between frames and cause visible jumping. */
        row.style.setProperty('height', `${height}px`, 'important');
        row.style.setProperty('min-height', '0px', 'important');
        row.style.setProperty('opacity', isSelected ? '1' : String(Math.max(0, remaining)), 'important');
        row.style.setProperty(
          'transform',
          isSelected
            ? 'translate3d(0,0,0) scaleY(1)'
            : `translate3d(0,${(index < selectedWeekIndex ? 3 : -3) * collapseProgress}px,0) scaleY(${0.92 + 0.08 * remaining})`,
          'important'
        );
        row.style.setProperty(
          'visibility',
          !isSelected && collapseProgress > 0.995 ? 'hidden' : 'visible',
          'important'
        );
      });

      grid.classList.toggle('is-week-mode', collapseProgress > 0.98);

      if (collapseHandle) {
        collapseHandle.style.setProperty('height', `${Math.round(14 - 6 * collapseProgress)}px`, 'important');
        collapseHandle.style.setProperty('opacity', String(1 - 0.45 * collapseProgress), 'important');
      }

      if (!timeline || !timelineContent || !timelineTrack || !timelineThumb) return;

      const hiddenWeekCount = Math.max(0, rows.length - 1);
      const expandedHeight = TIMELINE_BASE_HEIGHT + Math.max(0, CALENDAR_ROW_HEIGHT * hiddenWeekCount - 18);
      const timelineHeight = Math.round(
        TIMELINE_BASE_HEIGHT + (expandedHeight - TIMELINE_BASE_HEIGHT) * collapseProgress
      );
      timeline.style.setProperty('height', `${timelineHeight}px`, 'important');

      /* Same delayed timeline movement as desktop. */
      const timelineProgress = smoothstep(clamp((calendarSegment - 0.16) / 0.84));
      const timelineMaxShift = Math.max(0, timelineContent.scrollHeight - timeline.clientHeight);
      timelineContent.style.setProperty(
        'transform',
        `translate3d(0, ${-Math.round(timelineMaxShift * timelineProgress)}px, 0)`,
        'important'
      );

      const trackHeight = timelineTrack.clientHeight;
      const ratio = Math.min(
        1,
        timeline.clientHeight / Math.max(timeline.clientHeight, timelineContent.scrollHeight)
      );
      const thumbHeight = Math.max(24, Math.round(trackHeight * ratio));
      const thumbTravel = Math.max(0, trackHeight - thumbHeight);
      timelineThumb.style.setProperty('height', `${thumbHeight}px`, 'important');
      timelineThumb.style.setProperty(
        'transform',
        `translateY(${Math.round(thumbTravel * timelineProgress)}px)`,
        'important'
      );
      timelineTrack.style.setProperty('opacity', timelineMaxShift > 3 ? '.72' : '0', 'important');
    };

    const requestUpdate = () => {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    mobileQuery.addEventListener?.('change', requestUpdate);

    requestUpdate();
    return true;
  };

  const boot = () => {
    if (install()) return;
    let attempts = 0;
    const waitForMobileCalendar = () => {
      attempts += 1;
      if (install() || attempts > 360) return;
      requestAnimationFrame(waitForMobileCalendar);
    };
    requestAnimationFrame(waitForMobileCalendar);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
