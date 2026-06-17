(()=>{
  if (window.TWORK_NATIVE_V4_BOOT) return;
  window.TWORK_NATIVE_V4_BOOT = true;

  const inflate = async value => {
    if (!value) throw new Error('Quiz payload is missing');
    const bytes = Uint8Array.from(atob(value), character => character.charCodeAt(0));
    if (typeof DecompressionStream !== 'function') {
      throw new Error('DecompressionStream is unavailable');
    }
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new TextDecoder().decode(await new Response(stream).arrayBuffer());
  };

  (async () => {
    const [css, i18n, script] = await Promise.all([
      inflate(window.__TWQ4_CSS),
      inflate(window.__TWQ4_I18N),
      inflate((window.__TWQ4_JS1 || '') + (window.__TWQ4_JS2 || ''))
    ]);

    document.getElementById('twork-native-quiz-v4-style')?.remove();
    const style = document.createElement('style');
    style.id = 'twork-native-quiz-v4-style';
    style.textContent = css;
    document.head.appendChild(style);

    (0, eval)(i18n);
    (0, eval)(script);
  })().catch(error => console.error('[TWORK native quiz v4]', error));
})();
