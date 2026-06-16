(() => {
  const languages = [
    ['sk','Slovenčina'],['en','English'],['ru','Русский'],['cs','Čeština'],['hu','Magyar'],['pl','Polski'],['de','Deutsch'],['uk','Українська'],['es','Español'],['fr','Français'],['pt','Português'],['ar','العربية'],['zh-Hans','简体中文'],['ja','日本語'],['ko','한국어']
  ];
  const names = Object.fromEntries(languages);
  const labels = {
    sk:'Jazyk',en:'Language',ru:'Язык',cs:'Jazyk',hu:'Nyelv',pl:'Język',de:'Sprache',uk:'Мова',es:'Idioma',fr:'Langue',pt:'Idioma',ar:'اللغة','zh-Hans':'语言',ja:'言語',ko:'언어'
  };
  const root = document.documentElement;
  const matrixPools = {
    latin:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    digits:'0123456789',
    cjk:'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ',
    arabic:'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'
  };

  let installed = false;
  let bypass = false;
  let busy = false;
  let cleanupTimer = 0;
  let activeFrame = 0;

  const currentLanguage = () => root.dataset.siteLanguage || localStorage.getItem('twork-site-language') || 'en';
  const shortCode = language => language === 'zh-Hans' ? 'ZH' : language.toUpperCase();
  const clamp = value => Math.max(0,Math.min(1,value));

  const switcherElements = () => {
    const switcher = document.querySelector('.language-switcher');
    return {
      switcher,
      button: switcher?.querySelector('.language-switcher-button'),
      menu: switcher?.querySelector('.language-menu')
    };
  };

  const buildButton = () => {
    const { button, menu } = switcherElements();
    if (!button || !menu) return false;

    if (!button.querySelector('.language-current-name')) {
      button.innerHTML = `
        <span class="language-selected-dot" aria-hidden="true"></span>
        <span class="language-selected-copy">
          <strong class="language-current-name"></strong>
        </span>
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
    const { button, menu } = switcherElements();
    const name = names[language] || names.en;
    const currentName = button.querySelector('.language-current-name');
    const currentCode = button.querySelector('.language-current-code');
    if (currentName && currentName.textContent !== name) currentName.textContent = name;
    if (currentCode && currentCode.textContent !== shortCode(language)) currentCode.textContent = shortCode(language);
    button.setAttribute('aria-label', `${labels[language] || labels.en}: ${name}`);
    button.dataset.language = language;
    button.removeAttribute('aria-busy');

    const head = menu.querySelector('.language-menu-head');
    if (head) {
      const label = labels[language] || labels.en;
      if (head.querySelector('span')?.textContent !== label) head.querySelector('span').textContent = label;
      if (head.querySelector('strong')?.textContent !== name) head.querySelector('strong').textContent = name;
    }

    menu.querySelectorAll('.language-option').forEach(option => {
      const selected = option.dataset.language === language;
      option.setAttribute('aria-checked', String(selected));
      option.setAttribute('aria-selected', String(selected));
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

  const isScrambleCharacter = character => /[\p{L}\p{N}]/u.test(character);

  const randomGlyphFor = character => {
    let pool = matrixPools.latin;
    if (/\p{N}/u.test(character)) pool = matrixPools.digits;
    else if (/[\u3040-\u30ff\u3400-\u9fff]/u.test(character)) pool = matrixPools.cjk;
    else if (/[\u0600-\u06ff]/u.test(character)) pool = matrixPools.arabic;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const collectVisibleText = () => {
    const entries = [];
    const parents = new Map();
    let characters = 0;
    const walker = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{
      acceptNode(node) {
        const parent = node.parentElement;
        const text = node.nodeValue || '';
        if (!parent || !text.trim()) return NodeFilter.FILTER_REJECT;
        if (parent.closest('.language-switcher,.matrix-language-transition,.language-change-wave,script,style,svg,[aria-hidden="true"]')) return NodeFilter.FILTER_REJECT;
        const style = getComputedStyle(parent);
        if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < .02) return NodeFilter.FILTER_REJECT;
        const rect = parent.getBoundingClientRect();
        if (rect.bottom < -16 || rect.top > innerHeight + 16 || rect.right < 0 || rect.left > innerWidth) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let node;
    while ((node = walker.nextNode())) {
      const original = node.nodeValue || '';
      if (!segmentText(original).some(isScrambleCharacter)) continue;
      characters += original.length;
      if (characters > 2600 || entries.length >= 180) break;
      const parent = node.parentElement;
      const rect = parent.getBoundingClientRect();
      entries.push({ node, original, target: original, rect });
      if (!parents.has(parent)) parents.set(parent,rect);
    }
    return { entries, parents:[...parents.entries()].map(([element,rect]) => ({element,rect})) };
  };

  const addMotionClass = (parents,className) => {
    parents.forEach(({element,rect},index) => {
      const vertical = Math.max(0,Math.min(1,(rect.top + rect.height * .5) / Math.max(1,innerHeight)));
      element.style.setProperty('--matrix-delay',`${Math.round(vertical * 92 + (index % 6) * 4)}ms`);
      element.classList.remove('matrix-scramble-out','matrix-scramble-in');
      element.classList.add('matrix-scramble-target',className);
    });
  };

  const clearMotionClass = parents => {
    parents.forEach(({element}) => {
      element.classList.remove('matrix-scramble-target','matrix-scramble-out','matrix-scramble-in');
      element.style.removeProperty('--matrix-delay');
    });
  };

  const scrambledValue = (source,progress,phase,entryIndex,frameIndex) => {
    const graphemes = segmentText(source);
    const total = graphemes.length;
    return graphemes.map((character,index) => {
      if (!isScrambleCharacter(character)) return character;

      const position = total <= 1 ? 0 : index / (total - 1);
      const seed = ((entryIndex + 3) * 37 + (index + 5) * 17) % 100;
      const threshold = .08 + (seed / 100) * .78;

      if (phase === 'out') {
        const activation = clamp((progress - position * .18) / .82);
        if (activation <= .04) return character;
        return randomGlyphFor(character);
      }

      const settle = clamp((progress - position * .12) / .88);
      if (settle >= threshold || progress > .97) return character;
      if ((frameIndex + index + entryIndex) % 3 === 0) return randomGlyphFor(character);
      return randomGlyphFor(character);
    }).join('');
  };

  const runScramble = (entries,phase,duration) => new Promise(resolve => {
    window.cancelAnimationFrame(activeFrame);
    const startedAt = performance.now();
    let frameIndex = 0;

    const render = timestamp => {
      const progress = clamp((timestamp - startedAt) / duration);
      frameIndex += 1;
      entries.forEach((entry,index) => {
        if (!entry.node.isConnected) return;
        const source = phase === 'out' ? entry.original : entry.target;
        const next = scrambledValue(source,progress,phase,index,frameIndex);
        if (entry.node.nodeValue !== next) entry.node.nodeValue = next;
      });

      if (progress < 1) {
        activeFrame = window.requestAnimationFrame(render);
      } else {
        entries.forEach(entry => {
          if (!entry.node.isConnected) return;
          const finalText = phase === 'out' ? entry.original : entry.target;
          if (entry.node.nodeValue !== finalText) entry.node.nodeValue = finalText;
        });
        resolve();
      }
    };
    activeFrame = window.requestAnimationFrame(render);
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

  const releaseInterface = (outgoing = null,incoming = null) => {
    window.clearTimeout(cleanupTimer);
    window.cancelAnimationFrame(activeFrame);

    [outgoing,incoming].forEach(group => {
      group?.entries?.forEach(entry => {
        if (!entry.node.isConnected) return;
        const finalText = entry.target || entry.original;
        if (entry.node.nodeValue !== finalText) entry.node.nodeValue = finalText;
      });
      if (group?.parents) clearMotionClass(group.parents);
    });

    root.classList.remove('language-switch-busy','language-morphing','matrix-interface-switching');
    const { button } = switcherElements();
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
    const { switcher, button } = switcherElements();
    switcher?.classList.remove('is-open');
    button?.setAttribute('aria-expanded','false');
    button?.setAttribute('aria-busy','true');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const outgoing = reduced ? null : collectVisibleText();
    let incoming = null;
    cleanupTimer = window.setTimeout(() => releaseInterface(outgoing,incoming),1800);

    try {
      if (!reduced && outgoing.entries.length) {
        addMotionClass(outgoing.parents,'matrix-scramble-out');
        await runScramble(outgoing.entries,'out',280);
      }

      triggerBaseSwitch(option);
      refreshTranslations(language);

      await new Promise(resolve => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));

      if (!reduced) {
        clearMotionClass(outgoing?.parents || []);
        incoming = collectVisibleText();
        incoming.entries.forEach(entry => {
          entry.target = entry.node.nodeValue || '';
          const fullyScrambled = scrambledValue(entry.target,0,'in',0,0);
          if (entry.node.nodeValue !== fullyScrambled) entry.node.nodeValue = fullyScrambled;
        });
        addMotionClass(incoming.parents,'matrix-scramble-in');
        await runScramble(incoming.entries,'in',430);
      }

      releaseInterface(outgoing,incoming);
    } catch {
      releaseInterface(outgoing,incoming);
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
      releaseInterface();
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
