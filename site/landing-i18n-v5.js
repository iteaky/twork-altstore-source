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

  const currentLanguage = () => root.dataset.siteLanguage || localStorage.getItem('twork-site-language') || 'en';
  const shortCode = language => language === 'zh-Hans' ? 'ZH' : language.toUpperCase();

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
    if (currentName) currentName.textContent = name;
    if (currentCode) currentCode.textContent = shortCode(language);
    button.setAttribute('aria-label', `${labels[language] || labels.en}: ${name}`);
    button.dataset.language = language;
    button.removeAttribute('aria-busy');

    const head = menu.querySelector('.language-menu-head');
    if (head) {
      head.querySelector('span').textContent = labels[language] || labels.en;
      head.querySelector('strong').textContent = name;
    }

    menu.querySelectorAll('.language-option').forEach(option => {
      const selected = option.dataset.language === language;
      option.setAttribute('aria-checked', String(selected));
      option.setAttribute('aria-selected', String(selected));
      option.tabIndex = selected ? 0 : -1;
    });
  };

  const visibleTargets = () => {
    const selector = 'h1,h2,h3,h4,p,a,button,label,small,b,strong,span,time';
    const result = [];
    const seen = new Set();

    document.querySelectorAll(selector).forEach(element => {
      if (result.length >= 140) return;
      if (element.closest('.language-switcher,.matrix-language-transition,.language-change-wave,[aria-hidden="true"]')) return;
      const directText = [...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim());
      if (!directText) return;
      const style = getComputedStyle(element);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) < .02) return;
      const rect = element.getBoundingClientRect();
      if (rect.bottom < -12 || rect.top > innerHeight + 12 || rect.right < 0 || rect.left > innerWidth) return;
      const key = `${Math.round(rect.left)}:${Math.round(rect.top)}:${element.tagName}`;
      if (seen.has(key)) return;
      seen.add(key);
      result.push(element);
    });
    return result;
  };

  const animateTargets = (elements, className) => {
    elements.forEach((element,index) => {
      const rect = element.getBoundingClientRect();
      const vertical = Math.max(0,Math.min(1,(rect.top + rect.height * .5) / Math.max(1,innerHeight)));
      element.style.setProperty('--language-delay', `${Math.round(vertical * 72 + (index % 5) * 5)}ms`);
      element.classList.remove('language-morph-out','language-morph-in');
      void element.offsetWidth;
      element.classList.add('language-morph-target',className);
    });
  };

  const clearTargets = elements => {
    elements.forEach(element => {
      element.classList.remove('language-morph-target','language-morph-out','language-morph-in');
      element.style.removeProperty('--language-delay');
    });
  };

  const createWave = () => {
    document.querySelector('.language-change-wave')?.remove();
    const wave = document.createElement('div');
    wave.className = 'language-change-wave';
    document.body.appendChild(wave);
    return wave;
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

  const releaseInterface = (outgoing = [], incoming = [], wave = null) => {
    window.clearTimeout(cleanupTimer);
    clearTargets(outgoing);
    clearTargets(incoming);
    wave?.remove();
    document.querySelector('.language-change-wave')?.remove();
    root.classList.remove('language-switch-busy','language-morphing','matrix-interface-switching');
    const { button } = switcherElements();
    button?.removeAttribute('aria-busy');
    busy = false;
  };

  const switchLanguage = (option, language) => {
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
    const outgoing = reduced ? [] : visibleTargets();
    const wave = reduced ? null : createWave();
    if (!reduced) animateTargets(outgoing,'language-morph-out');

    let incoming = [];
    cleanupTimer = window.setTimeout(() => releaseInterface(outgoing,incoming,wave),1400);

    window.setTimeout(() => {
      try {
        triggerBaseSwitch(option);
        refreshTranslations(language);

        window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
          clearTargets(outgoing);
          if (!reduced) {
            incoming = visibleTargets();
            animateTargets(incoming,'language-morph-in');
          }
          window.setTimeout(() => releaseInterface(outgoing,incoming,wave),reduced ? 60 : 470);
        }));
      } catch {
        releaseInterface(outgoing,incoming,wave);
      }
    }, reduced ? 0 : 250);
  };

  const install = () => {
    if (installed || !buildButton()) return;
    installed = true;
    updateButton();

    document.addEventListener('click', event => {
      const option = event.target.closest?.('.language-option');
      if (!option || bypass) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      switchLanguage(option,option.dataset.language);
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
