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

  const invokeBaseSwitch = option => {
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

  const triggerBaseSwitch = async (option,language) => {
    // Let the original pointer/click dispatch finish before invoking the native
    // language option. This avoids Safari getting stuck after Cyrillic locales.
    await wait(0);
    invokeBaseSwitch(option);
    await nextFrame();

    // One guarded retry covers WebKit cases where a synthetic click is dropped.
    if (currentLanguage() !== language) {
      await wait(32);
      invokeBaseSwitch(option);
      await nextFrame();
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
    },120);

    window.setTimeout(() => {
      try { window.TWORK_I18N_GENERATED?.(language); } catch {}
      try { window.TWORK_I18N_CLEANUP?.(language); } catch {}
      updateButton(language);
    },340);
  };

  const applyLanguage = async (option,language) => {
    await triggerBaseSwitch(option,language);
    refreshTranslations(language);
    await nextFrame();
    await nextFrame();
  };

  const createTransitionLayer = () => {
    const layer = document.createElement('div');
    layer.className = 'locale-v9-layer';
    layer.setAttribute('aria-hidden','true');
    layer.innerHTML = '<span class="locale-v9-glow"></span><span class="locale-v9-lens"></span>';
    document.body.appendChild(layer);
    return layer;
  };

  const animateElement = (element,keyframes,options) => {
    if (!element?.animate) return Promise.resolve();
    const animation = element.animate(keyframes,options);
    return animation.finished.catch(() => {});
  };

  const clearSurfaceAnimations = surfaces => {
    surfaces.forEach(element => {
      element.getAnimations().forEach(animation => animation.cancel());
      element.style.removeProperty('opacity');
      element.style.removeProperty('filter');
      element.style.removeProperty('transform');
    });
  };

  const runReducedTransition = async (option,language) => {
    const surface = document.querySelector('main');
    await animateElement(surface,[{opacity:1},{opacity:.88}],{duration:150,easing:'ease-out',fill:'forwards'});
    await applyLanguage(option,language);
    await animateElement(surface,[{opacity:.88},{opacity:1}],{duration:260,easing:'ease-out',fill:'forwards'});
    clearSurfaceAnimations([surface].filter(Boolean));
  };

  const runVisibleTransition = async (option,language,button) => {
    const surfaces = [document.querySelector('main'),document.querySelector('.site-footer')].filter(Boolean);
    const code = button?.querySelector('.language-current-code');
    const layer = createTransitionLayer();

    await nextFrame();
    layer.classList.add('is-active');

    await Promise.all([
      ...surfaces.map(element => animateElement(element,[
        {opacity:1,filter:'blur(0px) saturate(1)',transform:'translate3d(0,0,0) scale(1)'},
        {opacity:.70,filter:'blur(4px) saturate(.97)',transform:'translate3d(0,1px,0) scale(.999)'}
      ],{duration:360,easing:'cubic-bezier(.32,0,.2,1)',fill:'forwards'})),
      animateElement(code,[
        {opacity:1,filter:'blur(0)',transform:'translateY(0) scale(1)'},
        {opacity:.08,filter:'blur(3px)',transform:'translateY(2px) scale(.94)'}
      ],{duration:260,easing:'cubic-bezier(.32,0,.2,1)',fill:'forwards'})
    ]);

    await applyLanguage(option,language);
    await wait(70);

    const nextCode = button?.querySelector('.language-current-code');
    await Promise.all([
      ...surfaces.map(element => animateElement(element,[
        {opacity:.50,filter:'blur(8px) saturate(1.03)',transform:'translate3d(0,3px,0) scale(1.002)'},
        {opacity:.88,filter:'blur(2px) saturate(1.01)',transform:'translate3d(0,.5px,0) scale(1.0005)',offset:.62},
        {opacity:1,filter:'blur(0px) saturate(1)',transform:'translate3d(0,0,0) scale(1)'}
      ],{duration:720,easing:'cubic-bezier(.16,.84,.2,1)',fill:'forwards'})),
      animateElement(nextCode,[
        {opacity:0,filter:'blur(4px)',transform:'translateY(-3px) scale(.93)'},
        {opacity:1,filter:'blur(0)',transform:'translateY(0) scale(1)'}
      ],{duration:500,easing:'cubic-bezier(.16,.9,.2,1)',fill:'forwards'})
    ]);

    await wait(120);
    clearSurfaceAnimations([...surfaces,nextCode].filter(Boolean));
    layer.remove();
  };

  const cleanup = () => {
    window.clearTimeout(safetyTimer);
    document.querySelectorAll('.locale-v9-layer').forEach(element => element.remove());
    root.classList.remove('language-switch-busy');
    removeLegacyMatrix();
    const {button} = switcherElements();
    button?.removeAttribute('aria-busy');
    busy = false;
  };

  const switchLanguage = async (option,language) => {
    if (busy) return;
    if (!language || language === currentLanguage()) {
      updateButton(language || currentLanguage());
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
    safetyTimer = window.setTimeout(cleanup,3600);

    try {
      if (reduced) await runReducedTransition(option,language);
      else await runVisibleTransition(option,language,button);
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
      const language = option.dataset.language;
      window.setTimeout(() => void switchLanguage(option,language),0);
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
