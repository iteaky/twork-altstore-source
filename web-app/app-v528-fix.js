(() => {
  const root = document.querySelector('#home-content');
  if (!root) return;

  function fixCards() {
    root.querySelectorAll(':scope > .mini-circle, :scope > .special-trailing, :scope > .chevron').forEach(el => el.remove());

    [...root.querySelectorAll('.home-action')].forEach(button => {
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

  new MutationObserver(fixCards).observe(root, { childList: true });
  fixCards();
})();
