(() => {
  if (window.__TWORK_I18N_BRIDGE__) return;

  const nativeAddEventListener = EventTarget.prototype.addEventListener;
  const handlers = new WeakMap();
  let restored = false;

  const bridge = {
    handlers,
    ready:false,
    restore() {
      if (restored) return;
      restored = true;
      if (EventTarget.prototype.addEventListener === interceptedAddEventListener) {
        EventTarget.prototype.addEventListener = nativeAddEventListener;
      }
      bridge.ready = true;
    }
  };

  function interceptedAddEventListener(type, listener, options) {
    if (
      type === 'click' &&
      typeof listener === 'function' &&
      this instanceof Element &&
      this.classList?.contains('language-option')
    ) {
      handlers.set(this, listener);
      Object.defineProperty(this, '__tworkBaseLanguageHandler', {
        configurable:true,
        value:listener
      });
    }
    return nativeAddEventListener.call(this, type, listener, options);
  }

  EventTarget.prototype.addEventListener = interceptedAddEventListener;
  window.__TWORK_I18N_BRIDGE__ = bridge;

  window.TWORK_INVOKE_BASE_LANGUAGE = option => {
    const handler = option?.__tworkBaseLanguageHandler || handlers.get(option);
    if (typeof handler !== 'function') return false;

    const nativeMatchMedia = window.matchMedia;
    window.matchMedia = query => {
      const result = nativeMatchMedia.call(window,query);
      if (query === '(prefers-reduced-motion: reduce)') {
        return new Proxy(result,{get(target,property){
          if (property === 'matches') return true;
          return Reflect.get(target,property,target);
        }});
      }
      return result;
    };

    try {
      handler.call(option, {
        type:'click',
        target:option,
        currentTarget:option,
        preventDefault() {},
        stopPropagation() {},
        stopImmediatePropagation() {}
      });
    } finally {
      window.matchMedia = nativeMatchMedia;
    }

    return document.documentElement.dataset.siteLanguage === option.dataset.language;
  };

  const observer = new MutationObserver(() => {
    const options = [...document.querySelectorAll('.language-switcher .language-option')];
    if (!options.length || options.some(option => !handlers.has(option))) return;
    observer.disconnect();
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => bridge.restore()));
  });

  const observe = () => {
    if (!document.documentElement) {
      window.requestAnimationFrame(observe);
      return;
    }
    observer.observe(document.documentElement, {childList:true, subtree:true});
  };

  observe();
  window.setTimeout(() => bridge.restore(), 5000);
})();
