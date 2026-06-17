(() => {
  if (window.TWORK_QUIZ_END_VISIBLE_FIX_V2) return;
  window.TWORK_QUIZ_END_VISIBLE_FIX_V2 = true;

  const revealQuizBlock = () => {
    const section = document.getElementById('setup-quiz-end');
    if (!section) return false;

    section.hidden = false;
    section.style.removeProperty('display');
    section.style.setProperty('visibility', 'visible', 'important');
    section.style.setProperty('opacity', '1', 'important');

    section.querySelectorAll('.reveal').forEach(element => {
      element.classList.remove('reveal');
      element.classList.add('visible');
    });

    section.querySelectorAll('.quiz-end-card, .quiz-end-copy, .quiz-end-file').forEach(element => {
      element.style.setProperty('visibility', 'visible', 'important');
      element.style.setProperty('opacity', '1', 'important');
      element.style.setProperty('transform', 'none', 'important');
    });

    return true;
  };

  const run = () => {
    revealQuizBlock();
    [60, 250, 700, 1500, 3000].forEach(delay => window.setTimeout(revealQuizBlock, delay));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }

  window.addEventListener('load', run, { once: true });
  new MutationObserver(revealQuizBlock).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
