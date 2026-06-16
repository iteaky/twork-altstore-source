(() => {
  const NativeMutationObserver = window.MutationObserver;
  if (typeof NativeMutationObserver === 'function' && !window.__tworkSafeMutationObserver) {
    window.__tworkSafeMutationObserver = true;

    function SafeMutationObserver(callback) {
      const snapshots = new WeakMap();
      const observer = new NativeMutationObserver((records, nativeObserver) => {
        const filtered = records.filter(record => {
          if (record.type === 'characterData') {
            const value = record.target.nodeValue || '';
            if (snapshots.get(record.target) === value) return false;
            snapshots.set(record.target, value);
            return true;
          }
          if (record.type === 'childList') {
            const value = record.target.textContent || '';
            if (snapshots.get(record.target) === value) return false;
            snapshots.set(record.target, value);
          }
          return true;
        });
        if (filtered.length) callback(filtered, nativeObserver);
      });
      return observer;
    }

    SafeMutationObserver.prototype = NativeMutationObserver.prototype;
    window.MutationObserver = SafeMutationObserver;
  }

  const clearLanguageState = () => {
    document.documentElement.classList.remove(
      'language-switch-busy',
      'language-morphing',
      'matrix-interface-switching'
    );
    document.querySelectorAll(
      '.matrix-language-transition,.language-morph-scan,.language-change-wave'
    ).forEach(element => element.remove());
    document.querySelectorAll('.locale-morph-target,.language-morph-target').forEach(element => {
      element.classList.remove(
        'locale-morph-target','locale-morph-out','locale-morph-in',
        'language-morph-target','language-morph-out','language-morph-in'
      );
      element.style.removeProperty('--locale-delay');
      element.style.removeProperty('--language-delay');
    });
    const button = document.querySelector('.language-switcher-button');
    button?.removeAttribute('aria-busy');
    button?.style.removeProperty('pointer-events');
  };

  clearLanguageState();
  window.addEventListener('pageshow', clearLanguageState, { passive: true });
})();
