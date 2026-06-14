(() => {
  const addEntry = () => {
    const actions = document.querySelector('.hero-actions');
    if (!actions || actions.querySelector('.web-app-button')) return;

    const link = document.createElement('a');
    link.className = 'web-app-button';
    link.href = 'web-app/';
    link.target = '_blank';
    link.rel = 'noopener';
    link.innerHTML = '<span class="web-app-dot" aria-hidden="true"></span><span>Открыть веб-версию</span>';
    actions.insertBefore(link, actions.querySelector('.text-link'));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addEntry, { once:true });
  } else {
    addEntry();
  }
})();
