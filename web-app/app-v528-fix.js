(() => {
  const homeRoot = document.querySelector('#home-content');
  const detailRoot = document.querySelector('#detail-screen');
  if (!homeRoot || !detailRoot) return;

  function fixCards() {
    homeRoot.querySelectorAll(':scope > .mini-circle, :scope > .special-trailing, :scope > .chevron').forEach(el => el.remove());

    [...homeRoot.querySelectorAll('.home-action')].forEach(button => {
      let card = button;
      if (button.tagName === 'BUTTON') {
        card = document.createElement('div');
        card.className = button.className;
        card.dataset.open = button.dataset.open;
        card.setAttribute('role', 'button');
        card.tabIndex = 0;
        card.innerHTML = button.innerHTML;
        button.replaceWith(card);
      }

      const title = card.querySelector('h3')?.textContent.trim();
      const action = title === 'Клиенты' ? ['topup', 'Принять оплату', '＋'] : title === 'Заметки' ? ['note', 'Добавить заметку', '✎'] : null;
      if (action && !card.querySelector('.special-trailing')) {
        const trailing = document.createElement('span');
        trailing.className = 'special-trailing';
        trailing.innerHTML = `<button class="mini-circle" type="button" data-quick="${action[0]}" aria-label="${action[1]}">${action[2]}</button><span class="chevron"></span>`;
        card.appendChild(trailing);
      }

      if (!card.dataset.keyboardReady) {
        card.dataset.keyboardReady = 'true';
        card.addEventListener('keydown', event => {
          if ((event.key === 'Enter' || event.key === ' ') && !event.target.closest('.mini-circle')) {
            event.preventDefault();
            card.click();
          }
        });
      }
    });
  }

  function fixMonthTail() {
    const grid = detailRoot.querySelector('.calendar-grid:not(.week-strip)');
    if (!grid) return;
    const cells = [...grid.querySelectorAll('.calendar-cell')];
    if (cells.length !== 35) return;

    cells.slice(30).forEach((cell, index) => {
      const julyDay = index + 1;
      cell.classList.add('muted');
      cell.dataset.date = `2026-07-${String(julyDay).padStart(2, '0')}`;
      const number = cell.querySelector('.n');
      if (number) number.textContent = String(julyDay);
      cell.querySelectorAll('.train-count,.line-marker').forEach(marker => marker.remove());
    });
  }

  new MutationObserver(fixCards).observe(homeRoot, { childList: true });
  new MutationObserver(fixMonthTail).observe(detailRoot, { childList: true, subtree: true });
  fixCards();
  fixMonthTail();
})();
