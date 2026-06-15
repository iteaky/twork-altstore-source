(() => {
  const apply = () => {
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

    const oldSelected = screen.querySelector('.hero-cal-selected');
    if (oldSelected) {
      const fragment = document.createElement('div');
      fragment.innerHTML = `
        <div class="hero-cal-datebar">
          <span>‹</span>
          <div><b>14 июня</b><small>Сегодня</small></div>
          <span>›</span>
        </div>
        <div class="hero-cal-timeline" aria-label="Расписание на 14 июня">
          ${Array.from({ length: 11 }, (_, index) => {
            const hour = index + 9;
            return `<div class="hero-cal-hour" style="top:${index * 20}px"><span>${String(hour).padStart(2, '0')}:00</span></div>`;
          }).join('')}
          <div class="hero-cal-event" style="top:20px;height:36px"><b>10:00 · Сплит-тренировка</b><small>Максим и Олег · TWORK Studio</small></div>
          <div class="hero-cal-event duty" style="top:120px;height:54px"><b>15:00 · Дежурство</b><small>Iron Club · до 18:00</small></div>
          <div class="hero-cal-event" style="top:180px;height:34px"><b>18:00 · Персональная</b><small>Анна Ковалёва · абонемент</small></div>
          <div class="hero-cal-now" style="top:87px"></div>
        </div>`;
      oldSelected.replaceWith(...fragment.childNodes);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, { once: true });
  } else {
    apply();
  }
})();
