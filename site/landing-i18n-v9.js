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
    button.removeAttribute('aria-busy');

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

  const applyLanguage = async (option,language) => {
    triggerBaseSwitch(option);
    refreshTranslations(language);
    await nextFrame();
    await nextFrame();
  };

  const createRefraction = button => {
    const rect = button?.getBoundingClientRect();
    const sheen = document.createElement('div');
    sheen.className = 'locale-v9-refraction';
    sheen.setAttribute('aria-hidden','true');
    if (rect) {
      sheen.style.setProperty('--locale-origin-x',`${Math.round(rect.left - Math.max(160,window.innerWidth * .18))}px`);
    }
    document.body.appendChild(sheen);
    return sheen;
  };

  const animateElement = (element,keyframes,options) => {
    if (!element?.animate) return Promise.resolve();
    const animation = element.animate(keyframes,options);
    return animation.finished.catch(() => {});
  };

  const runFallbackTransition = async (option,language,button) => {
    const surfaces = [
      document.querySelector('.site-nav'),
      document.querySelector('main'),
      document.querySelector('.site-footer')
    ].filter(Boolean);
    const sheen = createRefraction(button);

    root.classList.add('locale-v9-fallback-out');
    await Promise.all(surfaces.map(element => animateElement(element,[
      {opacity:1,filter:'blur(0px)',transform:'translateY(0) scale(1)'},
      {opacity:.56,filter:'blur(7px)',transform:'translateY(1px) scale(.998)'}
    ],{duration:150,easing:'cubic-bezier(.4,0,1,1)',fill:'forwards'})));

    root.classList.remove('locale-v9-fallback-out');
    await applyLanguage(option,language);
    root.classList.add('locale-v9-fallback-in');

    await Promise.all(surfaces.map(element => animateElement(element,[
      {opacity:.34,filter:'blur(11px)',transform:'translateY(-2px) scale(1.003)'},
      {opacity:1,filter:'blur(0px)',transform:'translateY(0) scale(1)'}
    ],{duration:390,easing:'cubic-bezier(.16,.84,.2,1)',fill:'forwards'})));

    root.classList.remove('locale-v9-fallback-in');
    surfaces.forEach(element => {
      element.getAnimations().forEach(animation => animation.cancel());
      element.style.removeProperty('opacity');
      element.style.removeProperty('filter');
      element.style.removeProperty('transform');
    });
    sheen.remove();
  };

  const runViewTransition = async (option,language,button) => {
    const transition = document.startViewTransition(() => applyLanguage(option,language));
    let sheen = null;
    try {
      await transition.ready;
      sheen = createRefraction(button);
      await transition.finished;
      await wait(35);
    } finally {
      sheen?.remove();
    }
  };

  const cleanup = () => {
    window.clearTimeout(safetyTimer);
    document.querySelectorAll('.locale-v9-refraction').forEach(element => element.remove());
    root.classList.remove('language-switch-busy','locale-v9-fallback-out','locale-v9-fallback-in');
    removeLegacyMatrix();
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
    removeLegacyMatrix();
    root.classList.add('language-switch-busy');
    const {switcher,button} = switcherElements();
    switcher?.classList.remove('is-open');
    button?.setAttribute('aria-expanded','false');
    button?.setAttribute('aria-busy','true');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    safetyTimer = window.setTimeout(cleanup,2200);

    try {
      if (reduced) {
        await applyLanguage(option,language);
      } else if (typeof document.startViewTransition === 'function') {
        await runViewTransition(option,language,button);
      } else {
        await runFallbackTransition(option,language,button);
      }
    } finally {
      cleanup();
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
    if (switcher) {
      new MutationObserver(scheduleButtonSync).observe(switcher,{childList:true,subtree:true});
    }

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',boot,{once:true});
  } else {
    boot();
  }
})();
