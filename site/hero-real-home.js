(() => {
  const screen = document.querySelector('.device-main .app-screen');
  if (!screen || screen.dataset.realHomeReady === 'true') return;

  screen.dataset.realHomeReady = 'true';
  screen.className = 'app-screen real-home-preview';
  screen.innerHTML = `
    <div class="real-app-topline"><span>9:41</span><span>● ● ●</span></div>
    <div class="real-home-header">
      <span class="real-home-logo" role="img" aria-label="TWORK"></span>
      <span class="real-home-gear" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6Z"/><path d="M19.4 13.2v-2.4l-2-.6a7.4 7.4 0 0 0-.6-1.4l1-1.8-1.7-1.7-1.8 1a7.4 7.4 0 0 0-1.4-.6l-.6-2H9.9l-.6 2a7.4 7.4 0 0 0-1.4.6l-1.8-1-1.7 1.7 1 1.8a7.4 7.4 0 0 0-.6 1.4l-2 .6v2.4l2 .6c.1.5.3 1 .6 1.4l-1 1.8 1.7 1.7 1.8-1c.4.3.9.5 1.4.6l.6 2h2.4l.6-2c.5-.1 1-.3 1.4-.6l1.8 1 1.7-1.7-1-1.8c.3-.4.5-.9.6-1.4l2-.6Z"/></svg>
      </span>
    </div>
    <div class="real-home-date">Воскресенье, 14 июня</div>
    <div class="real-home-stack">
      <article class="real-schedule-card">
        <div class="real-schedule-title"><b>Тренировки</b><span class="real-chevron"></span></div>
        <div class="real-day-card">
          <div class="real-day-head"><b>Сегодня</b><span>3 тренировки</span></div>
          <div class="real-training-row"><time>10:00</time><strong>Максим и Олег</strong></div>
          <div class="real-training-row"><time>15:00</time><strong>Iron Club · дежурство</strong></div>
          <div class="real-training-row"><time>18:00</time><strong>Анна Ковалёва</strong></div>
        </div>
        <div class="real-day-card">
          <div class="real-day-head"><b>Завтра</b><span>1 тренировка</span></div>
          <div class="real-training-row"><time>10:00</time><strong>Mark · онлайн</strong></div>
        </div>
      </article>
      <article class="real-home-action">
        <span class="real-action-icon" style="background:linear-gradient(145deg,#c79feb,#a880d6)">
          <svg viewBox="0 0 24 24"><path d="M5 17h14l-1.5-2.2V10a5.5 5.5 0 0 0-11 0v4.8L5 17Z"/><path d="M9.5 19.5a2.8 2.8 0 0 0 5 0"/></svg>
        </span>
        <span class="real-action-copy"><b>Уведомления</b><span>5 сообщений к отправке</span></span>
        <span class="real-action-badge">5</span>
      </article>
      <article class="real-home-action">
        <span class="real-action-icon" style="background:linear-gradient(145deg,#8cc7d9,#73a6c7)">
          <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M7 8h.1M10 8h7M7 12h.1M10 12h7M7 16h.1M10 16h5"/></svg>
        </span>
        <span class="real-action-copy"><b>Онлайн</b><span>Управление доступом к ресурсам</span></span>
        <span class="real-chevron"></span>
      </article>
      <article class="real-home-action">
        <span class="real-action-icon" style="background:linear-gradient(145deg,#d9b89e,#bf9980)">
          <svg viewBox="0 0 24 24"><path d="M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM3 20c.4-4.3 2.6-6.5 6.5-6.5S15.6 15.7 16 20"/><path d="M16 11a3 3 0 1 0 0-6M16.2 14c2.8.1 4.4 2.1 4.8 5"/></svg>
        </span>
        <span class="real-action-copy"><b>Клиенты</b><span>2 клиента с долгом</span></span>
        <span class="real-action-badge">2</span>
      </article>
      <article class="real-home-action">
        <span class="real-action-icon" style="background:linear-gradient(145deg,#e493a4,#cf6f84)">
          <svg viewBox="0 0 24 24"><path d="M4 21V8l8-4 8 4v13M2 21h20M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-3h4v3"/></svg>
        </span>
        <span class="real-action-copy"><b>Клубы</b><span>Клиенты и взаиморасчёты</span></span>
        <span class="real-chevron"></span>
      </article>
    </div>
    <div class="real-preview-fade"></div>`;
})();
