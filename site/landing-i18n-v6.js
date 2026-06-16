(() => {
  const languages = [
    ['sk','Slovenčina'],['en','English'],['ru','Русский'],['cs','Čeština'],['hu','Magyar'],['pl','Polski'],['de','Deutsch'],['uk','Українська'],['es','Español'],['fr','Français'],['pt','Português'],['ar','العربية'],['zh-Hans','简体中文'],['ja','日本語'],['ko','한국어']
  ];
  const names = Object.fromEntries(languages);
  const labels = {
    sk:'Jazyk',en:'Language',ru:'Язык',cs:'Jazyk',hu:'Nyelv',pl:'Język',de:'Sprache',uk:'Мова',es:'Idioma',fr:'Langue',pt:'Idioma',ar:'اللغة','zh-Hans':'语言',ja:'言語',ko:'언어'
  };
  const pools = {
    latin:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    digits:'0123456789',
    cjk:'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ',
    arabic:'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'
  };

  const root = document.documentElement;
  let installed = false;
  let bypass = false;
  let busy = false;
  let cleanupTimer = 0;
  let frameId = 0;

  const clamp = value => Math.max(0,Math.min(1,value));
  const currentLanguage = () => root.dataset.siteLanguage || localStorage.getItem('twork-site-language') || 'en';
  const shortCode = language => language === 'zh-Hans' ? 'ZH' : language.toUpperCase();

  const switcherElements = () => {
    const switcher = document.querySelector('.language-switcher');
    return {
      switcher,
      button:switcher?.querySelector('.language-switcher-button'),
      menu:switcher?.querySelector('.language-menu')
    };
  };

  const buildButton = () => {
    const {button,menu} = switcherElements();
    if (!button || !menu) return false;

    if (!button.querySelector('.language-current-name')) {
      button.innerHTML = `
        <span class="language-selected-dot" aria-hidden="true"></span>
        <span class="language-selected-copy"><strong class="language-current-name"></strong></span>
        <span class="language-current-code language-code"></span>
        <span class="language-caret" aria-hidden="true">⌄</span>`;
    }

    if (!menu.querySelector('.language-menu-head')) {
      const head = document.createElement('div');
      head.className = 'language-menu-head';
      head.innerHTML = '<span></span><strong></strong>';
      menu.prepend(head);
    }
    return true;
  };

  const updateButton = (language = currentLanguage()) => {
    if (!buildButton()) return;
    const {button,menu} = switcherElements();
    const name = names[language] || names.en;
    const label = labels[language] || labels.en;
    const nameElement = button.querySelector('.language-current-name');
    const codeElement = button.querySelector('.language-current-code');

    if (nameElement && nameElement.textContent !== name) nameElement.textContent = name;
    if (codeElement && codeElement.textContent !== shortCode(language)) codeElement.textContent = shortCode(language);
    button.dataset.language = language;
    button.setAttribute('aria-label',`${label}: ${name}`);
    button.removeAttribute('aria-busy');

    const head = menu.querySelector('.language-menu-head');
    if (head) {
      if (head.querySelector('span')?.textContent !== label) head.querySelector('span').textContent = label;
      if (head.querySelector('strong')?.textContent !== name) head.querySelector('strong').textContent = name;
    }

    menu.querySelectorAll('.language-option').forEach(option => {
      const selected = option.dataset.language === language;
      option.setAttribute('aria-checked',String(selected));
      option.setAttribute('aria-selected',String(selected));
      option.tabIndex = selected ? 0 : -1;
    });
  };

  const segmentText = text => {
    try {
      return [...new Intl.Segmenter(currentLanguage(),{granularity:'grapheme'}).segment(text)].map(item => item.segment);
    } catch {
      return Array.from(text);
    }
  };

  const isCodeCharacter = character => /[\p{L}\p{N}]/u.test(character);
  const glyphFor = character => {
    let pool = pools.latin;
    if (/\p{N}/u.test(character)) pool = pools.digits;
    else if (/[\u3040-\u30ff\u3400-\u9fff]/u.test(character)) pool = pools.cjk;
    else if (/[\u0600-\u06ff]/u.test(character)) pool = pools.arabic;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const scrambled = (text,progress,phase,fragmentIndex,frameIndex) => {
    const parts = segmentText(text);
    const total = Math.max(1,parts.length - 1);
    return parts.map((character,index) => {
      if (!isCodeCharacter(character)) return character;
      const horizontal = index / total;
      const seed = ((fragmentIndex + 7) * 31 + (index + 11) * 19) % 100;

      if (phase === 'out') {
        const active = clamp((progress - horizontal * .18) / .82);
        if (active < .04) return character;
        return glyphFor(character);
      }

      const settleAt = .14 + (seed / 100) * .72 + horizontal * .08;
      if (progress >= settleAt || progress > .97) return character;
      if ((frameIndex + index + fragmentIndex) % 2 === 0) return glyphFor(character);
      return glyphFor(character);
    }).join('');
  };

  const collectFragments = () => {
    const selector = 'h1,h2,h3,h4,p,a,button,label,small,b,strong,span,time';
    const fragments = [];
    const seen = new Set();
    let totalCharacters = 0;

    document.querySelectorAll(selector).forEach(element => {
      if (fragments.length >= 150 || totalCharacters >= 2400) return;
      if (element.closest('.language-switcher,.matrix-code-fragment,.matrix-language-transition,script,style,svg,[aria-hidden="true"]')) return;
      const textNodes = [...element.childNodes].filter(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
      if (!textNodes.length) return;

      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < .02) return;
      const rect = element.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1 || rect.bottom < -16 || rect.top > innerHeight + 16 || rect.right < 0 || rect.left > innerWidth) return;

      const text = textNodes.map(node => node.nodeValue).join('');
      if (!segmentText(text).some(isCodeCharacter)) return;
      const key = `${Math.round(rect.left)}:${Math.round(rect.top)}:${Math.round(rect.width)}:${element.tagName}:${text}`;
      if (seen.has(key)) return;
      seen.add(key);
      totalCharacters += text.length;
      fragments.push({element,text,rect,style});
    });
    return fragments;
  };

  const createOverlay = (fragment,phase,index) => {
    const overlay = document.createElement('span');
    overlay.className = `matrix-code-fragment matrix-code-${phase}`;
    overlay.setAttribute('aria-hidden','true');
    overlay.style.left = `${fragment.rect.left}px`;
    overlay.style.top = `${fragment.rect.top}px`;
    overlay.style.width = `${fragment.rect.width}px`;
    overlay.style.height = `${fragment.rect.height}px`;
    overlay.style.color = fragment.style.color;
    overlay.style.fontFamily = fragment.style.fontFamily;
    overlay.style.fontSize = fragment.style.fontSize;
    overlay.style.fontWeight = fragment.style.fontWeight;
    overlay.style.fontStyle = fragment.style.fontStyle;
    overlay.style.lineHeight = fragment.style.lineHeight;
    overlay.style.letterSpacing = fragment.style.letterSpacing;
    overlay.style.textTransform = fragment.style.textTransform;
    overlay.style.textAlign = fragment.style.textAlign;
    overlay.style.direction = fragment.style.direction;
    overlay.style.setProperty('--matrix-delay',`${Math.round(clamp(fragment.rect.top / Math.max(1,innerHeight)) * 92 + (index % 6) * 4)}ms`);
    overlay.textContent = phase === 'out' ? fragment.text : scrambled(fragment.text,0,'in',index,0);
    document.body.appendChild(overlay);
    return overlay;
  };

  const addSourceClass = (fragments,className) => {
    fragments.forEach((fragment,index) => {
      fragment.element.style.setProperty('--matrix-delay',`${Math.round(clamp(fragment.rect.top / Math.max(1,innerHeight)) * 92 + (index % 6) * 4)}ms`);
      fragment.element.classList.remove('matrix-source-out','matrix-source-in');
      fragment.element.classList.add(className);
    });
  };

  const clearSourceClasses = fragments => {
    fragments.forEach(fragment => {
      fragment.element.classList.remove('matrix-source-out','matrix-source-in');
      fragment.element.style.removeProperty('--matrix-delay');
    });
  };

  const animateOverlays = (fragments,phase,duration) => new Promise(resolve => {
    window.cancelAnimationFrame(frameId);
    const overlays = fragments.map((fragment,index) => createOverlay(fragment,phase,index));
    const startedAt = performance.now();
    let frameIndex = 0;

    const render = timestamp => {
      const progress = clamp((timestamp - startedAt) / duration);
      frameIndex += 1;
      overlays.forEach((overlay,index) => {
        if (!overlay.isConnected) return;
        const next = scrambled(fragments[index].text,progress,phase,index,frameIndex);
        if (overlay.textContent !== next) overlay.textContent = next;
      });

      if (progress < 1) {
        frameId = window.requestAnimationFrame(render);
      } else {
        overlays.forEach((overlay,index) => {
          if (phase === 'in' && overlay.isConnected) overlay.textContent = fragments[index].text;
        });
        resolve(overlays);
      }
    };
    frameId = window.requestAnimationFrame(render);
  });

  const triggerBaseSwitch = option => {
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

    bypass = true;
    try {
      option.click();
    } finally {
      bypass = false;
      window.matchMedia = nativeMatchMedia;
    }
  };

  const refreshTranslations = language => {
    try { window.TWORK_I18N_GENERATED?.(language); } catch {}
    try { window.TWORK_I18N_CLEANUP?.(language); } catch {}
    updateButton(language);
    window.setTimeout(() => {
      try { window.TWORK_I18N_GENERATED?.(language); } catch {}
      try { window.TWORK_I18N_CLEANUP?.(language); } catch {}
      updateButton(language);
    },90);
    window.setTimeout(() => {
      try { window.TWORK_I18N_GENERATED?.(language); } catch {}
      try { window.TWORK_I18N_CLEANUP?.(language); } catch {}
      updateButton(language);
    },260);
  };

  const cleanup = (outgoing = [],incoming = [],overlays = []) => {
    window.clearTimeout(cleanupTimer);
    window.cancelAnimationFrame(frameId);
    clearSourceClasses(outgoing);
    clearSourceClasses(incoming);
    overlays.forEach(overlay => overlay.remove());
    document.querySelectorAll('.matrix-code-fragment').forEach(element => element.remove());
    root.classList.remove('language-switch-busy','language-morphing','matrix-interface-switching');
    const {button} = switcherElements();
    button?.removeAttribute('aria-busy');
    busy = false;
  };

  const switchLanguage = async (option,language) => {
    if (busy) return;
    if (language === currentLanguage()) {
      updateButton(language);
      return;
    }

    busy = true;
    root.classList.add('language-switch-busy');
    const {switcher,button} = switcherElements();
    switcher?.classList.remove('is-open');
    button?.setAttribute('aria-expanded','false');
    button?.setAttribute('aria-busy','true');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const outgoing = reduced ? [] : collectFragments();
    let incoming = [];
    let overlays = [];
    cleanupTimer = window.setTimeout(() => cleanup(outgoing,incoming,overlays),1800);

    try {
      if (!reduced && outgoing.length) {
        addSourceClass(outgoing,'matrix-source-out');
        overlays = await animateOverlays(outgoing,'out',280);
      }

      triggerBaseSwitch(option);
      refreshTranslations(language);
      await new Promise(resolve => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));

      if (!reduced) {
        incoming = collectFragments();
        addSourceClass(incoming,'matrix-source-in');
        clearSourceClasses(outgoing);
        overlays.forEach(overlay => overlay.remove());
        overlays = await animateOverlays(incoming,'in',440);
      }

      cleanup(outgoing,incoming,overlays);
    } catch {
      cleanup(outgoing,incoming,overlays);
    }
  };

  const install = () => {
    if (installed || !buildButton()) return;
    installed = true;
    updateButton();

    document.addEventListener('click',event => {
      const option = event.target.closest?.('.language-option');
      if (!option || bypass) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      void switchLanguage(option,option.dataset.language);
    },true);

    new MutationObserver(() => updateButton()).observe(root,{
      attributes:true,
      attributeFilter:['data-site-language','lang','dir']
    });

    window.addEventListener('pageshow',() => {
      cleanup();
      updateButton();
      refreshTranslations(currentLanguage());
    },{passive:true});
  };

  const boot = () => {
    const wait = () => {
      if (!document.querySelector('.language-switcher .language-option')) {
        window.requestAnimationFrame(wait);
        return;
      }
      install();
      refreshTranslations(currentLanguage());
    };
    window.requestAnimationFrame(wait);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
