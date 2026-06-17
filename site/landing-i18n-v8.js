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

    if (button.dataset.compactLanguageButton !== 'true') {
      const code = document.createElement('span');
      code.className = 'language-current-code language-code';
      button.replaceChildren(code);
      button.dataset.compactLanguageButton = 'true';
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
    if (!buildCompactButton()) return;
    const {button,menu} = switcherElements();
    const name = names[language] || names.en;
    const label = labels[language] || labels.en;
    const code = button.querySelector('.language-current-code');

    if (code && code.textContent !== shortCode(language)) code.textContent = shortCode(language);
    button.dataset.language = language;
    button.setAttribute('aria-label',`${label}: ${name}`);
    button.title = `${label}: ${name}`;
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

  const removeLegacyAnimation = () => {
    document.querySelectorAll(
      '.matrix-code-fragment,.matrix-transition-veil,.matrix-language-transition,.matrix-inline-run,.language-morph-scan,.language-change-wave,.locale-morph-target,.language-morph-target,.matrix-scramble-target'
    ).forEach(element => element.remove());
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

  const createTransitionLayer = () => {
    const layer = document.createElement('div');
    layer.className = 'locale-transition-layer';
    layer.setAttribute('aria-hidden','true');
    layer.innerHTML = '<span class="locale-transition-glow"></span><span class="locale-transition-lens"></span>';
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
    await animateElement(surface,[{opacity:1},{opacity:.72}],{duration:90,easing:'ease-out',fill:'forwards'});
    await applyLanguage(option,language);
    await animateElement(surface,[{opacity:.72},{opacity:1}],{duration:170,easing:'ease-out',fill:'forwards'});
    clearSurfaceAnimations([surface].filter(Boolean));
  };

  const runVisibleTransition = async (option,language) => {
    const surfaces = [document.querySelector('main'),document.querySelector('.site-footer')].filter(Boolean);
    const {button} = switcherElements();
    const code = button?.querySelector('.language-current-code');
    const layer = createTransitionLayer();

    await nextFrame();
    layer.classList.add('is-active');

    await Promise.all([
      ...surfaces.map(element => animateElement(element,[
        {opacity:1,filter:'blur(0px) saturate(1)',transform:'translate3d(0,0,0) scale(1)'},
        {opacity:.26,filter:'blur(11px) saturate(.88)',transform:'translate3d(0,3px,0) scale(.995)'}
      ],{duration:230,easing:'cubic-bezier(.42,0,1,1)',fill:'forwards'})),
      animateElement(code,[
        {opacity:1,filter:'blur(0)',transform:'translateY(0) scale(1)'},
        {opacity:0,filter:'blur(6px)',transform:'translateY(4px) scale(.86)'}
      ],{duration:170,easing:'cubic-bezier(.42,0,1,1)',fill:'forwards'})
    ]);

    await applyLanguage(option,language);
    await wait(70);

    const nextCode = button?.querySelector('.language-current-code');
    await Promise.all([
      ...surfaces.map(element => animateElement(element,[
        {opacity:.10,filter:'blur(18px) saturate(1.10)',transform:'translate3d(0,10px,0) scale(1.008)'},
        {opacity:.78,filter:'blur(4px) saturate(1.03)',transform:'translate3d(0,1px,0) scale(1.001)',offset:.68},
        {opacity:1,filter:'blur(0px) saturate(1)',transform:'translate3d(0,0,0) scale(1)'}
      ],{duration:520,easing:'cubic-bezier(.16,.84,.2,1)',fill:'forwards'})),
      animateElement(nextCode,[
        {opacity:0,filter:'blur(7px)',transform:'translateY(-5px) scale(.84)'},
        {opacity:1,filter:'blur(0)',transform:'translateY(0) scale(1)'}
      ],{duration:390,easing:'cubic-bezier(.16,.9,.2,1)',fill:'forwards'})
    ]);

    await wait(90);
    clearSurfaceAnimations([...surfaces,nextCode].filter(Boolean));
    layer.remove();
  };

  const cleanup = () => {
    window.clearTimeout(safetyTimer);
    document.querySelectorAll('.locale-transition-layer').forEach(element => element.remove());
    root.classList.remove('language-switch-busy','locale-view-transition');
    removeLegacyAnimation();
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
    removeLegacyAnimation();
    root.classList.add('language-switch-busy');
    const {switcher,button} = switcherElements();
    switcher?.classList.remove('is-open');
    button?.setAttribute('aria-expanded','false');
    button?.setAttribute('aria-busy','true');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    safetyTimer = window.setTimeout(cleanup,2600);

    try {
      if (reduced) await runReducedTransition(option,language);
      else await runVisibleTransition(option,language);
    } finally {
      cleanup();
    }
  };

  const install = () => {
    if (installed || !buildCompactButton()) return;
    installed = true;
    removeLegacyAnimation();
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
