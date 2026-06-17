(() => {
  const languages = [
    ['sk','Slovenčina'],['en','English'],['ru','Русский'],['cs','Čeština'],['hu','Magyar'],['pl','Polski'],['de','Deutsch'],['uk','Українська'],['es','Español'],['fr','Français'],['pt','Português'],['ar','العربية'],['zh-Hans','简体中文'],['ja','日本語'],['ko','한국어']
  ];
  const names = Object.fromEntries(languages);
  const labels = {
    sk:'Jazyk',en:'Language',ru:'Язык',cs:'Jazyk',hu:'Nyelv',pl:'Język',de:'Sprache',uk:'Мова',es:'Idioma',fr:'Langue',pt:'Idioma',ar:'اللغة','zh-Hans':'语言',ja:'言語',ko:'언어'
  };

  const root = document.documentElement;
  let installed = false;
  let bypass = false;
  let busy = false;
  let safetyTimer = 0;
  let syncScheduled = false;
  let pendingOption = null;
  let pendingLanguage = null;

  const currentLanguage = () => root.dataset.siteLanguage || localStorage.getItem('twork-site-language') || 'en';
  const shortCode = language => language === 'zh-Hans' ? 'ZH' : language.toUpperCase();
  const nextFrame = () => new Promise(resolve => window.requestAnimationFrame(resolve));
  const wait = duration => new Promise(resolve => window.setTimeout(resolve,duration));

  const switcherElements = () => {
    const switcher = document.querySelector('.language-switcher');
    return {
      switcher,
      button:switcher?.querySelector('.language-switcher-button'),
      menu:switcher?.querySelector('.language-menu')
    };
  };

  const buildCompactButton = () => {
    const {button,menu} = switcherElements();
    if (!button || !menu) return false;

    const code = button.querySelector('.language-current-code');
    if (button.children.length !== 1 || !code) {
      button.innerHTML = '<span class="language-current-code language-code"></span>';
    }
    button.dataset.compactLanguageButton = 'true';

    if (!menu.querySelector('.language-menu-head')) {
      const head = document.createElement('div');
      head.className = 'language-menu-head';
      head.innerHTML = '<span></span><strong></strong>';
      menu.prepend(head);
    }
    return true;
  };

  const updateButton = (language = currentLanguage()) => {
    if (!buildCompactButton()) return;
    const {button,menu} = switcherElements();
    const name = names[language] || names.en;
    const label = labels[language] || labels.en;
    const code = button.querySelector('.language-current-code');

    if (code && code.textContent !== shortCode(language)) code.textContent = shortCode(language);
    button.dataset.language = language;
    button.setAttribute('aria-label',`${label}: ${name}`);
    button.title = name;

    const head = menu.querySelector('.language-menu-head');
    if (head) {
      const headLabel = head.querySelector('span');
      const headName = head.querySelector('strong');
      if (headLabel && headLabel.textContent !== label) headLabel.textContent = label;
      if (headName && headName.textContent !== name) headName.textContent = name;
    }

    menu.querySelectorAll('.language-option').forEach(option => {
      const selected = option.dataset.language === language;
      option.setAttribute('aria-checked',String(selected));
      option.setAttribute('aria-selected',String(selected));
      option.tabIndex = selected ? 0 : -1;
    });
  };

  const removeLegacyMatrix = () => {
    document.querySelectorAll(
      '.matrix-code-fragment,.matrix-transition-veil,.matrix-language-transition,.matrix-inline-run,.language-morph-scan,.language-change-wave,.locale-morph-target,.language-morph-target,.matrix-scramble-target'
    ).forEach(element => element.remove());
    document.querySelectorAll('.matrix-source-out,.matrix-source-in').forEach(element => {
      element.classList.remove('matrix-source-out','matrix-source-in');
      element.style.removeProperty('--matrix-delay');
      element.style.removeProperty('--matrix-duration');
    });
    root.classList.remove('language-morphing','matrix-interface-switching');
  };

  const waitForBaseHandler = async option => {
    for (let attempt = 0; attempt < 8; attempt += 1) {
      if (typeof option?.__tworkBaseLanguageHandler === 'function') return true;
      await nextFrame();
    }
    return false;
  };

  const invokeBaseSwitch = async (option,language) => {
    await waitForBaseHandler(option);

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
      const invoked = window.TWORK_INVOKE_BASE_LANGUAGE?.(option) === true;
      if (!invoked) option.click();
    } finally {
      bypass = false;
      window.matchMedia = nativeMatchMedia;
    }

    await nextFrame();
    if (currentLanguage() !== language) {
      await wait(36);
      const invoked = window.TWORK_INVOKE_BASE_LANGUAGE?.(option) === true;
      if (!invoked) {
        bypass = true;
        try { option.click(); } finally { bypass = false; }
      }
      await nextFrame();
    }

    if (currentLanguage() !== language) {
      throw new Error(`Language switch did not apply: ${language}`);
    }
  };

  const refreshTranslations = language => {
    try { window.TWORK_I18N_GENERATED?.(language); } catch {}
    try { window.TWORK_I18N_CLEANUP?.(language); } catch {}
    updateButton(language);

    window.setTimeout(() => {
      try { window.TWORK_I18N_GENERATED?.(language); } catch {}
      try { window.TWORK_I18N_CLEANUP?.(language); } catch {}
      updateButton(currentLanguage());
    },110);

    window.setTimeout(() => {
      try { window.TWORK_I18N_GENERATED?.(language); } catch {}
      try { window.TWORK_I18N_CLEANUP?.(language); } catch {}
      updateButton(currentLanguage());
    },300);
  };

  const applyLanguage = async (option,language) => {
    await invokeBaseSwitch(option,language);
    refreshTranslations(language);
    await nextFrame();
  };

  const createTransitionLayer = button => {
    const rect = button?.getBoundingClientRect();
    const originX = rect ? rect.left + rect.width / 2 : window.innerWidth - 42;
    const originY = rect ? rect.top + rect.height / 2 : 32;
    const layer = document.createElement('div');
    layer.className = 'locale-v9-layer';
    layer.setAttribute('aria-hidden','true');
    layer.style.setProperty('--locale-origin-x',`${originX}px`);
    layer.style.setProperty('--locale-origin-y',`${originY}px`);
    layer.innerHTML = [
      '<span class="locale-v9-veil"></span>',
      '<span class="locale-v9-orb"></span>',
      '<span class="locale-v9-ring locale-v9-ring-a"></span>',
      '<span class="locale-v9-ring locale-v9-ring-b"></span>',
      '<span class="locale-v9-prism"></span>',
      '<span class="locale-v9-lens"></span>',
      '<span class="locale-v9-spark locale-v9-spark-a"></span>',
      '<span class="locale-v9-spark locale-v9-spark-b"></span>',
      '<span class="locale-v9-spark locale-v9-spark-c"></span>'
    ].join('');
    document.body.appendChild(layer);
    return layer;
  };

  const animateCode = async (code,phase) => {
    if (!code?.animate) return;
    const keyframes = phase === 'out'
      ? [
          {opacity:1,filter:'blur(0)',transform:'translateY(0) scale(1)'},
          {opacity:0,filter:'blur(5px)',transform:'translateY(4px) scale(.88)'}
        ]
      : [
          {opacity:0,filter:'blur(5px)',transform:'translateY(-4px) scale(.88)'},
          {opacity:1,filter:'blur(0)',transform:'translateY(0) scale(1)'}
        ];
    const animation = code.animate(keyframes,{
      duration:phase === 'out' ? 240 : 420,
      easing:'cubic-bezier(.2,.8,.2,1)',
      fill:'forwards'
    });
    await animation.finished.catch(() => {});
  };

  const restoreScroll = position => {
    if (window.scrollX !== position.x || window.scrollY !== position.y) {
      window.scrollTo(position.x,position.y);
    }
  };

  const runReducedTransition = async (option,language) => {
    const position = {x:window.scrollX,y:window.scrollY};
    await applyLanguage(option,language);
    restoreScroll(position);
  };

  const runVisibleTransition = async (option,language,button) => {
    const position = {x:window.scrollX,y:window.scrollY};
    const oldCode = button?.querySelector('.language-current-code');
    root.classList.add('language-view-transition');

    let layer;
    let transition;
    try {
      void animateCode(oldCode,'out');

      if (typeof document.startViewTransition === 'function') {
        transition = document.startViewTransition(async () => {
          await applyLanguage(option,language);
          restoreScroll(position);
        });
        await transition.ready;
        layer = createTransitionLayer(button);
        await nextFrame();
        layer.classList.add('is-active');
        const newCode = button?.querySelector('.language-current-code');
        void animateCode(newCode,'in');
        await Promise.all([
          transition.finished.catch(() => {}),
          wait(1180)
        ]);
      } else {
        layer = createTransitionLayer(button);
        await nextFrame();
        layer.classList.add('is-active');
        await wait(260);
        await applyLanguage(option,language);
        restoreScroll(position);
        const newCode = button?.querySelector('.language-current-code');
        void animateCode(newCode,'in');
        await wait(920);
      }

      layer?.classList.add('is-resolving');
      await wait(220);
    } finally {
      restoreScroll(position);
      layer?.remove();
      root.classList.remove('language-view-transition');
      oldCode?.getAnimations().forEach(animation => animation.cancel());
      button?.querySelector('.language-current-code')?.getAnimations().forEach(animation => animation.cancel());
    }
  };

  const cleanup = () => {
    window.clearTimeout(safetyTimer);
    document.querySelectorAll('.locale-v9-layer').forEach(element => element.remove());
    root.classList.remove('language-switch-busy','language-view-transition');
    removeLegacyMatrix();
    const {button} = switcherElements();
    button?.removeAttribute('aria-busy');
    button?.querySelector('.language-current-code')?.getAnimations().forEach(animation => animation.cancel());
    busy = false;
  };

  const runPendingSwitch = () => {
    if (!pendingOption || !pendingLanguage || pendingLanguage === currentLanguage()) {
      pendingOption = null;
      pendingLanguage = null;
      return;
    }
    const option = pendingOption;
    const language = pendingLanguage;
    pendingOption = null;
    pendingLanguage = null;
    window.setTimeout(() => void switchLanguage(option,language),0);
  };

  const switchLanguage = async (option,language) => {
    if (!language || language === currentLanguage()) {
      updateButton(language || currentLanguage());
      return;
    }
    if (busy) {
      pendingOption = option;
      pendingLanguage = language;
      return;
    }

    busy = true;
    removeLegacyMatrix();
    root.classList.add('language-switch-busy');
    const {switcher,button} = switcherElements();
    switcher?.classList.remove('is-open');
    button?.setAttribute('aria-expanded','false');
    button?.setAttribute('aria-busy','true');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    safetyTimer = window.setTimeout(() => {
      cleanup();
      runPendingSwitch();
    },4200);

    try {
      if (reduced) await runReducedTransition(option,language);
      else await runVisibleTransition(option,language,button);
    } catch (error) {
      console.error('[TWORK language switch]',error);
      updateButton(currentLanguage());
    } finally {
      cleanup();
      runPendingSwitch();
    }
  };

  const scheduleButtonSync = () => {
    if (syncScheduled) return;
    syncScheduled = true;
    window.requestAnimationFrame(() => {
      syncScheduled = false;
      updateButton();
    });
  };

  const install = () => {
    if (installed || !buildCompactButton()) return;
    installed = true;
    removeLegacyMatrix();
    updateButton();

    document.addEventListener('click',event => {
      const option = event.target.closest?.('.language-option');
      if (!option || bypass) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      void switchLanguage(option,option.dataset.language);
    },true);

    new MutationObserver(scheduleButtonSync).observe(root,{
      attributes:true,
      attributeFilter:['data-site-language','lang','dir']
    });

    const {switcher} = switcherElements();
    if (switcher) new MutationObserver(scheduleButtonSync).observe(switcher,{childList:true,subtree:true});

    window.addEventListener('pageshow',() => {
      cleanup();
      updateButton();
      refreshTranslations(currentLanguage());
    },{passive:true});
  };

  const boot = () => {
    const waitForSwitcher = () => {
      if (!document.querySelector('.language-switcher .language-option')) {
        window.requestAnimationFrame(waitForSwitcher);
        return;
      }
      install();
      refreshTranslations(currentLanguage());
    };
    window.requestAnimationFrame(waitForSwitcher);
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
