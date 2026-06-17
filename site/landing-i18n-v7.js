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
  let cleanupTimer = 0;
  let syncScheduled = false;

  const wait = duration => new Promise(resolve => window.setTimeout(resolve,duration));
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

  const compactButton = button => {
    if (!button) return;
    const code = button.querySelector('.language-current-code');
    const alreadyCompact = button.children.length === 1 && code;
    if (!alreadyCompact) {
      button.innerHTML = '<span class="language-current-code language-code"></span>';
    }
    button.dataset.compactLanguageButton = 'true';
  };

  const buildButton = () => {
    const {button,menu} = switcherElements();
    if (!button || !menu) return false;
    compactButton(button);

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
    const codeElement = button.querySelector('.language-current-code');

    if (codeElement && codeElement.textContent !== shortCode(language)) {
      codeElement.textContent = shortCode(language);
    }
    button.dataset.language = language;
    button.setAttribute('aria-label',`${label}: ${name}`);
    button.setAttribute('title',name);
    button.removeAttribute('aria-busy');

    const head = menu.querySelector('.language-menu-head');
    if (head) {
      const labelElement = head.querySelector('span');
      const nameElement = head.querySelector('strong');
      if (labelElement && labelElement.textContent !== label) labelElement.textContent = label;
      if (nameElement && nameElement.textContent !== name) nameElement.textContent = name;
    }

    menu.querySelectorAll('.language-option').forEach(option => {
      const selected = option.dataset.language === language;
      option.setAttribute('aria-checked',String(selected));
      option.setAttribute('aria-selected',String(selected));
      option.tabIndex = selected ? 0 : -1;
    });
  };

  const cleanupLegacyMatrix = () => {
    document.querySelectorAll(
      '.matrix-code-fragment,.matrix-transition-veil,.matrix-language-transition,.matrix-inline-run,.language-morph-scan,.language-change-wave,.locale-morph-target,.language-morph-target,.matrix-scramble-target'
    ).forEach(element => element.remove());
    root.classList.remove(
      'matrix-interface-switching','language-morphing','matrix-source-out','matrix-source-in'
    );
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

  const createGlassLens = button => {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const farX = Math.max(centerX,window.innerWidth - centerX);
    const farY = Math.max(centerY,window.innerHeight - centerY);
    const diameter = Math.ceil(Math.hypot(farX,farY) * 2.18);

    const lens = document.createElement('div');
    lens.className = 'locale-glass-lens';
    lens.setAttribute('aria-hidden','true');
    lens.style.setProperty('--locale-x',`${centerX}px`);
    lens.style.setProperty('--locale-y',`${centerY}px`);
    lens.style.setProperty('--locale-size',`${diameter}px`);
    lens.innerHTML = '<i class="locale-glass-caustic"></i><i class="locale-glass-ring"></i>';
    document.body.appendChild(lens);
    window.requestAnimationFrame(() => lens.classList.add('is-active'));
    return lens;
  };

  const cleanup = lens => {
    window.clearTimeout(cleanupTimer);
    cleanupLegacyMatrix();
    root.classList.remove('language-switch-busy','language-glass-out','language-glass-in');
    const {button} = switcherElements();
    button?.removeAttribute('aria-busy');
    lens?.remove();
    busy = false;
  };

  const switchLanguage = async (option,language) => {
    if (busy) return;
    if (language === currentLanguage()) {
      updateButton(language);
      return;
    }

    busy = true;
    cleanupLegacyMatrix();
    root.classList.add('language-switch-busy');

    const {switcher,button} = switcherElements();
    switcher?.classList.remove('is-open');
    button?.setAttribute('aria-expanded','false');
    button?.setAttribute('aria-busy','true');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lens = null;
    cleanupTimer = window.setTimeout(() => cleanup(lens),1800);

    try {
      if (reduced) {
        triggerBaseSwitch(option);
        refreshTranslations(language);
        cleanup(lens);
        return;
      }

      lens = createGlassLens(button);
      root.classList.add('language-glass-out');
      await wait(175);

      triggerBaseSwitch(option);
      refreshTranslations(language);
      await new Promise(resolve => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));

      root.classList.remove('language-glass-out');
      root.classList.add('language-glass-in');
      await wait(520);

      lens.classList.add('is-leaving');
      await wait(280);
      cleanup(lens);
    } catch {
      cleanup(lens);
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
    if (installed || !buildButton()) return;
    installed = true;
    cleanupLegacyMatrix();
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
