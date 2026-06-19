(() => {
  if (window.TWORK_ONBOARDING_QUIZ_V6_BOOT) return;
  window.TWORK_ONBOARDING_QUIZ_V6_BOOT = true;
  let queuedOpen = false;
  const queueOpen = event => {
    const opener = event?.target?.closest?.('[data-quiz-end-open],[data-twq6-open],[data-twq4-open]');
    if (!opener || window.TWORK_ONBOARDING_QUIZ_V6) return;
    event.preventDefault();
    queuedOpen = true;
  };
  document.addEventListener('click', queueOpen, true);
  window.TWORK_OPEN_SETUP_QUIZ = window.TWORK_OPEN_NATIVE_QUIZ = () => {
    queuedOpen = true;
    return true;
  };
  const load = src => new Promise((resolve,reject) => {
    const script=document.createElement('script');
    script.src=src;
    script.async=false;
    script.onload=resolve;
    script.onerror=()=>reject(new Error('Failed to load '+src));
    document.head.appendChild(script);
  });
  const inflate = async value => {
    if (!value) throw new Error('TWORK quiz payload is missing');
    const bytes = Uint8Array.from(atob(value), character => character.charCodeAt(0));
    if (typeof DecompressionStream !== 'function') throw new Error('DecompressionStream is unavailable');
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new TextDecoder().decode(await new Response(stream).arrayBuffer());
  };
  (async () => {
    for (const src of ["site/onboarding-quiz-v550-payload-01.js?v=20260619-1", "site/onboarding-quiz-v550-payload-02.js?v=20260619-1", "site/onboarding-quiz-v550-payload-03.js?v=20260619-1", "site/onboarding-quiz-v550-payload-04.js?v=20260619-1", "site/onboarding-quiz-v550-payload-05.js?v=20260619-1", "site/onboarding-quiz-v550-payload-06.js?v=20260619-1"]) await load(src);
    const source = await inflate(window.__TWQ6_PAYLOAD);
    (0, eval)(source);
    document.removeEventListener('click', queueOpen, true);
    if (queuedOpen && typeof window.TWORK_OPEN_SETUP_QUIZ === 'function') window.TWORK_OPEN_SETUP_QUIZ();
  })().catch(error => console.error('[TWORK onboarding quiz v550]', error));
})();
