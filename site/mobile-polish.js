(() => {
  const addCalendarCta = () => {
    const panel = document.querySelector('#calendar-sync');
    if (!panel || panel.querySelector('.mobile-calendar-cta')) return;

    const cta = document.createElement('div');
    cta.className = 'mobile-calendar-cta';
    cta.innerHTML = '<strong>Клиент видит остаток тренировок прямо в календаре</strong><p>Покажите расписание, долг и комментарии без отдельного личного кабинета.</p><button type="button">Запросить ранний доступ</button>';

    cta.querySelector('button')?.addEventListener('click', () => {
      document.querySelector('.nav-cta.js-access, .hero .js-access')?.click();
    });

    panel.appendChild(cta);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addCalendarCta, { once:true });
  } else {
    addCalendarCta();
  }
})();
