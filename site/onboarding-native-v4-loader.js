(()=>{
  if (window.TWORK_NATIVE_V4_BOOT) return;
  window.TWORK_NATIVE_V4_BOOT = true;
  const inflate = async value => {
    const bytes = Uint8Array.from(atob(value), c => c.charCodeAt(0));
    if (typeof DecompressionStream !== 'function') throw new Error('DecompressionStream is unavailable');
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new TextDecoder().decode(await new Response(stream).arrayBuffer());
  };
  (async()=>{
    const data = window.TWORK_NATIVE_V4_DATA;
    if (!data) throw new Error('Quiz data is missing');
    const [css,i18n,js] = await Promise.all([inflate(data.css),inflate(data.i18n),inflate(data.js)]);
    const style = document.createElement('style');
    style.id = 'twork-native-quiz-v4-style';
    style.textContent = css;
    document.head.appendChild(style);
    (0,eval)(i18n);
    (0,eval)(js);
  })().catch(error => console.error('[TWORK native quiz v4]', error));
})();
