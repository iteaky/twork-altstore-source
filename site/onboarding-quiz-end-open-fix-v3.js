(() => {
  if (window.TWORK_QUIZ_END_OPEN_FIX_V3) return;
  window.TWORK_QUIZ_END_OPEN_FIX_V3 = true;

  const promoSelector = '#setup-quiz-end';
  const quizText = /первая настройка|пропустить квиз|пройти квиз|квиз|quiz|onboarding|setup|first setup|skip quiz|continue|продолжить/i;
  const openText = /пройти|начать|открыть|start|open|launch|setup|quiz|квиз/i;

  const outsidePromo = (element, source) =>
    element && element !== source && !element.closest(promoSelector);

  const makeVisible = element => {
    if (!element) return false;

    let root = element;
    while (root.parentElement && root.parentElement !== document.body) {
      const style = getComputedStyle(root);
      const identity = `${root.id || ''} ${root.className || ''}`;
      const isLikelyRoot =
        root.matches('dialog,[role="dialog"],[aria-modal="true"]') ||
        /quiz|onboarding|setup|modal|overlay|sheet/i.test(identity) ||
        style.position === 'fixed';
      if (isLikelyRoot) break;
      root = root.parentElement;
    }

    [root, ...root.querySelectorAll('[hidden],[aria-hidden="true"],[inert]')].forEach(node => {
      node.hidden = false;
      node.removeAttribute('hidden');
      node.removeAttribute('inert');
      node.setAttribute('aria-hidden', 'false');
    });

    root.classList.add('open', 'is-open', 'active', 'visible', 'is-visible');
    root.style.setProperty('display', root.matches('dialog') ? 'block' : 'flex', 'important');
    root.style.setProperty('visibility', 'visible', 'important');
    root.style.setProperty('opacity', '1', 'important');
    root.style.setProperty('pointer-events', 'auto', 'important');
    root.style.setProperty('z-index', '2147483646', 'important');

    if (!['fixed', 'absolute'].includes(getComputedStyle(root).position)) {
      root.style.setProperty('position', 'fixed', 'important');
      root.style.setProperty('inset', '0', 'important');
    }

    if (root.matches('dialog') && typeof root.showModal === 'function' && !root.open) {
      try { root.showModal(); } catch (_) { root.setAttribute('open', ''); }
    }

    document.documentElement.classList.add('quiz-open', 'onboarding-open');
    document.body.classList.add('quiz-open', 'onboarding-open');
    document.body.style.setProperty('overflow', 'hidden', 'important');
    return true;
  };

  const findAndShowExistingQuiz = source => {
    const selectors = [
      'dialog',
      '[role="dialog"]',
      '[aria-modal="true"]',
      '[id*="quiz" i]',
      '[class*="quiz" i]',
      '[id*="onboarding" i]',
      '[class*="onboarding" i]',
      '[id*="setup" i]',
      '[class*="setup" i]'
    ];

    const candidates = [...new Set(document.querySelectorAll(selectors.join(',')))]
      .filter(element => outsidePromo(element, source))
      .map(element => {
        const text = element.textContent || '';
        const identity = `${element.id || ''} ${element.className || ''}`;
        let score = 0;
        if (quizText.test(text)) score += 10;
        if (/quiz|onboarding|setup/i.test(identity)) score += 6;
        if (element.matches('dialog,[role="dialog"],[aria-modal="true"]')) score += 5;
        if (text.length > 80) score += 2;
        return { element, score };
      })
      .filter(item => item.score >= 8)
      .sort((a, b) => b.score - a.score);

    return candidates.length ? makeVisible(candidates[0].element) : false;
  };

  const clickExistingLauncher = source => {
    const selectors = [
      '[data-setup-open]',
      '[data-twq-open]',
      '[data-quiz-open]',
      '[data-native-quiz-open]',
      '[data-onboarding-open]',
      '[data-open-quiz]',
      '[data-start-quiz]',
      '.setup-hero-button',
      '.js-setup-quiz',
      '.twq-open',
      '.quiz-open',
      'button[id*="quiz" i]',
      'button[class*="quiz" i]',
      'a[id*="quiz" i]',
      'a[class*="quiz" i]',
      '[role="button"][id*="quiz" i]',
      '[role="button"][class*="quiz" i]',
      'button[id*="onboarding" i]',
      'button[class*="onboarding" i]',
      'button[id*="setup" i]',
      'button[class*="setup" i]'
    ];

    const elements = [...new Set(document.querySelectorAll(selectors.join(',')))]
      .filter(element => outsidePromo(element, source));

    const launcher = elements.find(element => {
      const text = element.textContent || '';
      const identity = `${element.id || ''} ${element.className || ''}`;
      return openText.test(text) || /open|start|launch|trigger/i.test(identity);
    }) || elements[0];

    if (!launcher) return false;

    launcher.removeAttribute('disabled');
    launcher.disabled = false;
    launcher.click();
    launcher.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    return true;
  };

  const dispatchOpenEvents = source => {
    const names = [
      'twork:open-quiz',
      'twork:open-onboarding',
      'twq:open',
      'quiz:open',
      'setup:open',
      'onboarding:open',
      'openQuiz',
      'openSetupQuiz'
    ];

    names.forEach(name => {
      const detail = { source: 'landing-end', element: source };
      document.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
      window.dispatchEvent(new CustomEvent(name, { detail }));
    });
  };

  const openQuiz = source => {
    if (findAndShowExistingQuiz(source)) return;

    clickExistingLauncher(source);
    dispatchOpenEvents(source);

    [0, 40, 120, 300, 700].forEach(delay => {
      window.setTimeout(() => findAndShowExistingQuiz(source), delay);
    });
  };

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-quiz-end-open]');
    if (!button) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openQuiz(button);
  }, true);
})();
