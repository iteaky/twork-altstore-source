(() => {
  if (window.__TWORK_QUIZ_V564_LOADER__) return;
  window.__TWORK_QUIZ_V564_LOADER__ = true;

  const inflate = async value => {
    const normalized = String(value || '').replace(/\s+/g, '');
    if (!normalized) throw new Error('TWORK V564 runtime is missing');
    const decoded = atob(normalized);
    const bytes = Uint8Array.from(decoded, character => character.charCodeAt(0));
    if (bytes[0] !== 0x1f || bytes[1] !== 0x8b) throw new Error('TWORK V564 runtime is invalid');
    if (typeof DecompressionStream !== 'function') throw new Error('DecompressionStream is unavailable');
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new TextDecoder().decode(await new Response(stream).arrayBuffer());
  };

  (async () => {
    const source = await inflate(window.__TWQ564_RUNTIME_GZIP);
    (0, eval)(`${source}\n//# sourceURL=twork-onboarding-v564-runtime.js`);
  })().catch(error => console.error('[TWORK onboarding V564]', error));
})();