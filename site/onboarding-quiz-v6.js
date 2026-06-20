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

  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });

  const inflate = async value => {
    const normalized = String(value || '').replace(/\s+/g, '');
    if (!normalized) throw new Error('TWORK quiz payload is missing');
    if (normalized.length !== 70004) {
      throw new Error(`TWORK quiz payload has invalid length: ${normalized.length}`);
    }
    if (normalized.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) {
      throw new Error('TWORK quiz payload is not valid Base64');
    }

    const decoded = atob(normalized);
    const bytes = Uint8Array.from(decoded, character => character.charCodeAt(0));
    if (bytes[0] !== 0x1f || bytes[1] !== 0x8b) {
      throw new Error('TWORK quiz payload is not a GZIP stream');
    }
    if (typeof DecompressionStream !== 'function') {
      throw new Error('DecompressionStream is unavailable');
    }

    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new TextDecoder().decode(await new Response(stream).arrayBuffer());
  };

  (async () => {
    window.__TWQ6_PAYLOAD = '';
    const version = '20260620-1';
    const sources = [
      'site/onboarding-quiz-v550-payload-01.js',
      'site/onboarding-quiz-v550-payload-02.js',
      'site/onboarding-quiz-v550-payload-03.js',
      'site/onboarding-quiz-v550-payload-04-01.js',
      'site/onboarding-quiz-v550-payload-04-02.js',
      'site/onboarding-quiz-v550-payload-04-03.js',
      'site/onboarding-quiz-v550-payload-04-04.js',
      'site/onboarding-quiz-v550-payload-04-05.js',
      'site/onboarding-quiz-v550-payload-04-06.js',
      'site/onboarding-quiz-v550-payload-04-07.js',
      'site/onboarding-quiz-v550-payload-04-08.js',
      'site/onboarding-quiz-v550-payload-04-09.js',
      'site/onboarding-quiz-v550-payload-04-10.js',
      'site/onboarding-quiz-v550-payload-04-11.js',
      'site/onboarding-quiz-v550-payload-04-12.js',
      'site/onboarding-quiz-v550-payload-05.js',
      'site/onboarding-quiz-v550-payload-06.js'
    ];

    for (const source of sources) await load(`${source}?v=${version}`);

    const source = await inflate(window.__TWQ6_PAYLOAD);
    (0, eval)(`${source}\n//# sourceURL=onboarding-quiz-v550-inflated.js`);
    document.removeEventListener('click', queueOpen, true);
    if (queuedOpen && typeof window.TWORK_OPEN_SETUP_QUIZ === 'function') {
      window.TWORK_OPEN_SETUP_QUIZ();
    }
  })().catch(error => {
    document.removeEventListener('click', queueOpen, true);
    console.error('[TWORK onboarding quiz v550]', error);
  });
})();
