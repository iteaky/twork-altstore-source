(() => {
  const HOURS = [
    { key: '23', label: '23:00', top: 360 },
    { key: '00', label: '00:00', top: 384 }
  ];

  const patchScreen = screen => {
    const content = screen.querySelector('.hero-cal-timeline-content');
    if (!content) return false;

    HOURS.forEach(hour => {
      if (content.querySelector(`[data-twork-hour="${hour.key}"]`)) return;
      const line = document.createElement('div');
      line.className = 'hero-cal-hour';
      line.dataset.tworkHour = hour.key;
      line.style.top = `${hour.top}px`;
      line.innerHTML = `<span>${hour.label}</span>`;
      content.appendChild(line);
    });

    content.style.setProperty('height', '408px', 'important');
    return true;
  };

  const patchAll = () => {
    let patched = 0;
    document.querySelectorAll('#product .hero-calendar-screen').forEach(screen => {
      if (patchScreen(screen)) patched += 1;
    });
    return patched;
  };

  const boot = () => {
    let attempts = 0;
    const waitForScreens = () => {
      attempts += 1;
      const patched = patchAll();
      if (patched >= 2 || attempts > 300) return;
      requestAnimationFrame(waitForScreens);
    };
    requestAnimationFrame(waitForScreens);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
