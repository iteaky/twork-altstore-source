(() => {
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

  const bridgeSource = source => {
    const names = [...source.matchAll(/(?:function\s+|(?:const|let|var)\s+)([A-Za-z_$][\w$]*)/g)]
      .map(match => match[1])
      .filter((name, index, list) => list.indexOf(name) === index)
      .filter(name => /open|show|start|launch|present|mount|quiz|onboard|setup/i.test(name));

    if (!names.length) return source;

    const exports = names.map(name =>
      `try{if(typeof ${name}==='function')window.__TWORK_NATIVE_V4_INTERNAL[${JSON.stringify(name)}]=${name};}catch(_){}`
    ).join('');

    const bridge = `;window.__TWORK_NATIVE_V4_INTERNAL=window.__TWORK_NATIVE_V4_INTERNAL||{};${exports}`;
    const closingIndex = source.lastIndexOf('})();');
    return closingIndex >= 0
      ? `${source.slice(0, closingIndex)}${bridge}${source.slice(closingIndex)}`
      : source;
  };

  const quizTextPattern = /первая настройка|пропустить квиз|настроить twork|пройти квиз|квиз|first setup|skip quiz|setup quiz|onboarding/i;

  const revealQuiz = proxy => {
    const candidates = [...document.querySelectorAll('dialog,[role="dialog"],[aria-modal="true"],[id],[class]')]
      .filter(element => element !== proxy && !element.closest('#setup-quiz-end'))
      .map(element => {
        const text = element.textContent || '';
        const identity = `${element.id || ''} ${typeof element.className === 'string' ? element.className : ''}`;
        let score = 0;
        if (quizTextPattern.test(text)) score += 12;
        if (/quiz|onboarding|setup|wizard/i.test(identity)) score += 7;
        if (element.matches('dialog,[role="dialog"],[aria-modal="true"]')) score += 6;
        if (getComputedStyle(element).position === 'fixed') score += 4;
        return { element, score };
      })
      .filter(item => item.score >= 10)
      .sort((a, b) => b.score - a.score);

    if (!candidates.length) return false;

    let root = candidates[0].element;
    while (root.parentElement && root.parentElement !== document.body) {
      const parent = root.parentElement;
      const identity = `${parent.id || ''} ${typeof parent.className === 'string' ? parent.className : ''}`;
      const style = getComputedStyle(parent);
      if (parent.matches('dialog,[role="dialog"],[aria-modal="true"]') || /quiz|onboarding|setup|wizard|modal|overlay|sheet/i.test(identity) || style.position === 'fixed') {
        root = parent;
      } else {
        break;
      }
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

  const installLauncher = capturedClickListeners => {
    window.TWORK_OPEN_NATIVE_QUIZ = () => {
      const proxy = document.createElement('button');
      proxy.type = 'button';
      proxy.id = 'twork-native-quiz-launch-proxy';
      proxy.className = 'setup-hero-button js-setup-quiz twq-open quiz-launcher native-quiz-open onboarding-open start-quiz';
      [
        'data-setup-open', 'data-twq-open', 'data-quiz-open', 'data-native-quiz-open',
        'data-onboarding-open', 'data-open-quiz', 'data-start-quiz'
      ].forEach(attribute => proxy.setAttribute(attribute, '1'));
      proxy.textContent = 'Пройти квиз Start setup quiz';
      proxy.style.cssText = 'position:fixed;left:-10000px;top:-10000px;width:1px;height:1px;opacity:0;pointer-events:none;';
      document.body.appendChild(proxy);

      let invoked = false;
      const internal = window.__TWORK_NATIVE_V4_INTERNAL || {};
      Object.entries(internal)
        .filter(([name, fn]) => typeof fn === 'function' && /open|show|start|launch|present|mount/i.test(name))
        .forEach(([, fn]) => {
          try {
            fn({ target: proxy, currentTarget: proxy, preventDefault() {}, stopPropagation() {} });
            invoked = true;
          } catch (_) {
            try { fn(); invoked = true; } catch (_) {}
          }
        });

      proxy.click();
      proxy.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, composed: true, view: window }));

      capturedClickListeners.forEach(({ target, listener }) => {
        if (typeof listener !== 'function') return;
        if (![window, document, document.documentElement, document.body].includes(target)) return;
        try {
          listener.call(target, {
            type: 'click',
            target: proxy,
            currentTarget: target,
            defaultPrevented: false,
            preventDefault() {},
            stopPropagation() {},
            stopImmediatePropagation() {},
            composedPath: () => [proxy, document.body, document.documentElement, document, window]
          });
          invoked = true;
        } catch (_) {}
      });

      const delays = [0, 40, 120, 300, 700, 1400];
      delays.forEach(delay => window.setTimeout(() => revealQuiz(proxy), delay));
      window.setTimeout(() => proxy.remove(), 1800);
      return invoked || revealQuiz(proxy);
    };

    window.dispatchEvent(new CustomEvent('twork:native-quiz-ready'));
  };

  (async () => {
    const [css, i18n, scriptPart1, scriptPart2] = await Promise.all([
      inflate(window.__TWQ4_CSS),
      inflate(window.__TWQ4_I18N),
      inflate(window.__TWQ4_JS1),
      inflate(window.__TWQ4_JS2)
    ]);
    const script = scriptPart1 + scriptPart2;

    document.getElementById('twork-native-quiz-v4-style')?.remove();
    const style = document.createElement('style');
    style.id = 'twork-native-quiz-v4-style';
    style.textContent = css;
    document.head.appendChild(style);

    const capturedClickListeners = [];
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (type === 'click') capturedClickListeners.push({ target: this, listener, options });
      return originalAddEventListener.call(this, type, listener, options);
    };

    try {
      (0, eval)(i18n);
      (0, eval)(bridgeSource(script));
    } finally {
      EventTarget.prototype.addEventListener = originalAddEventListener;
    }

    installLauncher(capturedClickListeners);
  })().catch(error => console.error('[TWORK native quiz v4]', error));
})();
