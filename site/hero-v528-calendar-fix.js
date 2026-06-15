(() => {
  const clamp = value => Math.max(0, Math.min(1, value));
  const smoothstep = value => value * value * (3 - 2 * value);
  const statusMarkup = `
    <span class="hero-status-icons" aria-label="Связь, Wi-Fi, батарея">
      <span class="hero-signal" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="hero-wifi" aria-hidden="true"></span>
      <span class="hero-battery" aria-hidden="true"></span>
    </span>`;

  const removeOrphanedClientBlocks = () => {
    const product = document.querySelector('#product');
    document.querySelectorAll('.hero-client-grid').forEach(grid => {
      if (!product || !product.contains(grid)) grid.remove();
    });
    document.querySelectorAll('.hero-client-card').forEach(card => {
      if (!card.closest('.hero-client-screen')) card.remove();
    });
  };

  const applyClientServices = () => {
    const grid = document.querySelector('.hero-client-screen .hero-client-grid');
    if (!grid || grid.querySelector('.hero-service-card')) return;

    const card = document.createElement('section');
    card.className = 'hero-client-card hero-service-card';
    card.innerHTML = `
      <div class="hero-client-card-head"><i>◇</i><b>Услуги</b><span>Все</span></div>
      <div class="hero-service-body">
        <b>Онлайн-ведение</b>
        <span>1 июня – 31 июля</span>
        <strong>€ 120</strong>
        <small class="hero-service-pill">осталось: 1 мес. 16 дн.</small>
      </div>
      <div class="hero-client-card-footer">Открыть все услуги</div>`;
    grid.appendChild(card);
  };

  const prepareCalendarWeeks = screen => {
    const grid = screen.querySelector('.hero-cal-grid');
    if (!grid || grid.querySelector('.hero-cal-week-row')) return;

    const days = [...grid.children].filter(child => child.classList.contains('hero-cal-day'));
    if (days.length < 7) return;

    const fragment = document.createDocumentFragment();
    for (let index = 0; index < days.length; index += 7) {
      const weekDays = days.slice(index, index + 7);
      const row = document.createElement('div');
      row.className = 'hero-cal-week-row';
      row.dataset.weekIndex = String(index / 7);
      if (weekDays.some(day => day.classList.contains('selected'))) {
        row.classList.add('selected-week');
      }
      weekDays.forEach(day => row.appendChild(day));
      fragment.appendChild(row);
    }
    grid.replaceChildren(fragment);
  };

  const applyCalendarFix = () => {
    const screen = document.querySelector('.hero-calendar-screen');
    if (!screen || screen.dataset.v528CalendarFixed === 'true') return;
    screen.dataset.v528CalendarFixed = 'true';

    const mode = screen.querySelector('.hero-cal-mode');
    const free = screen.querySelector('.hero-cal-free');
    if (mode && free) {
      const controls = document.createElement('div');
      controls.className = 'hero-cal-controls';
      mode.before(controls);
      controls.append(mode, free);
    }

    prepareCalendarWeeks(screen);

    const oldSelected = screen.querySelector('.hero-cal-selected');
    if (oldSelected) {
      const hourStart = 8;
      const hourCount = 15;
      const hourStep = 24;
      const fragment = document.createElement('div');
      fragment.innerHTML = `
        <div class="hero-cal-datebar">
          <span>‹</span>
          <div><b>14 июня</b><small>Сегодня</small></div>
          <span>›</span>
        </div>
        <div class="hero-cal-timeline" aria-label="Расписание на 14 июня">
          <div class="hero-cal-timeline-content">
            ${Array.from({ length: hourCount }, (_, index) => {
              const hour = hourStart + index;
              return `<div class="hero-cal-hour" style="top:${index * hourStep}px"><span>${String(hour).padStart(2, '0')}:00</span></div>`;
            }).join('')}
            <div class="hero-cal-event" style="top:${(10 - hourStart) * hourStep}px;height:38px"><b>10:00 · Сплит-тренировка</b><small>Максим и Олег · TWORK Studio</small></div>
            <div class="hero-cal-event duty" style="top:${(15 - hourStart) * hourStep}px;height:70px"><b>15:00 · Дежурство</b><small>Iron Club · до 18:00</small></div>
            <div class="hero-cal-event" style="top:${(18 - hourStart) * hourStep}px;height:38px"><b>18:00 · Персональная</b><small>Анна Ковалёва · абонемент</small></div>
            <div class="hero-cal-event event" style="top:${(20 - hourStart) * hourStep}px;height:40px"><b>20:00 · Событие</b><small>Подготовка программы · 40 минут</small></div>
            <div class="hero-cal-now" style="top:${(13.5 - hourStart) * hourStep}px"></div>
          </div>
          <span class="hero-cal-timeline-track" aria-hidden="true"><i class="hero-cal-timeline-thumb"></i></span>
        </div>`;
      oldSelected.replaceWith(...fragment.childNodes);
    }
  };

  const applyScrollPhone = () => {
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

    const calendarGrid = product.querySelector('.hero-cal-grid');
    const calendarRows = [...product.querySelectorAll('.hero-cal-week-row')];
    const selectedWeek = product.querySelector('.hero-cal-week-row.selected-week');
    const selectedWeekIndex = Math.max(0, calendarRows.indexOf(selectedWeek));
    const collapseHandle = product.querySelector('.hero-cal-collapse');

    const timeline = product.querySelector('.hero-cal-timeline');
    const timelineContent = timeline?.querySelector('.hero-cal-timeline-content');
    const timelineTrack = timeline?.querySelector('.hero-cal-timeline-track');
    const timelineThumb = timeline?.querySelector('.hero-cal-timeline-thumb');

    let calendarRowHeight = selectedWeek?.getBoundingClientRect().height || 45;
    let timelineBaseHeight = timeline?.clientHeight || 214;

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

      /* Month-to-week transition occupies the first third of the product scroll.
         The selected week stays full-size while the other four rows fold away. */
      const collapseProgress = smoothstep(clamp(progress / 0.34));
      if (calendarGrid && calendarRows.length > 1) {
        calendarRows.forEach((row, index) => {
          const isSelected = index === selectedWeekIndex;
          const remaining = isSelected ? 1 : 1 - collapseProgress;
          row.style.height = `${Math.max(0, Math.round(calendarRowHeight * remaining))}px`;
          row.style.opacity = isSelected ? '1' : String(Math.max(0, remaining));
          row.style.transform = isSelected
            ? 'translate3d(0,0,0) scaleY(1)'
            : `translate3d(0,${(index < selectedWeekIndex ? 3 : -3) * collapseProgress}px,0) scaleY(${0.92 + 0.08 * remaining})`;
          row.style.visibility = !isSelected && collapseProgress > 0.995 ? 'hidden' : 'visible';
        });
        calendarGrid.classList.toggle('is-week-mode', collapseProgress > 0.98);
      }

      if (collapseHandle) {
        collapseHandle.style.height = `${Math.round(14 - 6 * collapseProgress)}px`;
        collapseHandle.style.opacity = String(1 - 0.45 * collapseProgress);
      }

      if (timeline && timelineContent && timelineTrack && timelineThumb) {
        const hiddenWeekCount = Math.max(0, calendarRows.length - 1);
        const expandedHeight = timelineBaseHeight + Math.max(0, calendarRowHeight * hiddenWeekCount - 18);
        timeline.style.height = `${Math.round(timelineBaseHeight + (expandedHeight - timelineBaseHeight) * collapseProgress)}px`;

        /* Timeline starts moving after the calendar has clearly begun folding. */
        const timelineProgress = smoothstep(clamp((progress - 0.16) / 0.84));
        const timelineMaxShift = Math.max(0, timelineContent.scrollHeight - timeline.clientHeight);
        timelineContent.style.transform = `translate3d(0, ${-Math.round(timelineMaxShift * timelineProgress)}px, 0)`;

        const timelineTrackHeight = timelineTrack.clientHeight;
        const timelineRatio = Math.min(1, timeline.clientHeight / Math.max(timeline.clientHeight, timelineContent.scrollHeight));
        const timelineThumbHeight = Math.max(24, Math.round(timelineTrackHeight * timelineRatio));
        const timelineThumbTravel = Math.max(0, timelineTrackHeight - timelineThumbHeight);
        timelineThumb.style.height = `${timelineThumbHeight}px`;
        timelineThumb.style.transform = `translateY(${Math.round(timelineThumbTravel * timelineProgress)}px)`;
        timelineTrack.style.opacity = timelineMaxShift > 3 ? '.72' : '0';
      }
    };

    const requestUpdate = () => {
      if (frameRequested) return;
      frameRequested = true;
      requestAnimationFrame(update);
    };

    const refreshMeasurements = () => {
      calendarRowHeight = selectedWeek?.getBoundingClientRect().height || (window.innerWidth <= 680 ? 40 : 45);
      timelineBaseHeight = window.innerWidth <= 680 ? 185 : 214;
      requestUpdate();
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', refreshMeasurements);
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(requestUpdate);
      observer.observe(scrollContent);
      if (timelineContent) observer.observe(timelineContent);
    }
    refreshMeasurements();
  };

  const apply = () => {
    removeOrphanedClientBlocks();
    applyClientServices();
    applyCalendarFix();
    applyScrollPhone();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
})();
