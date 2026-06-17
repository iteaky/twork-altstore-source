(() => {
  const bundle = window.TWORK_COMPLETE_I18N;
  if (!bundle?.keys?.length || !bundle?.values) return;

  const supported = ['sk','en','ru','cs','hu','pl','de','uk','es','fr','pt','ar','zh-Hans','ja','ko'];
  const normalize = value => String(value ?? '')
    .replace(/[\u200b-\u200d\ufeff]/g,'')
    .replace(/\u00a0/g,' ')
    .replace(/\s+/g,' ')
    .trim();
  const currentLanguage = () => {
    const value = document.documentElement.dataset.siteLanguage || localStorage.getItem('twork-site-language') || 'en';
    return supported.includes(value) ? value : 'en';
  };

  const translations = new Map();
  const reverse = new Map();
  bundle.keys.forEach((source,index) => {
    const row = { ru:source };
    for (const language of supported) {
      if (language === 'ru') continue;
      const value = bundle.values[language]?.[index];
      if (typeof value === 'string' && value.trim()) row[language] = value;
    }
    translations.set(source,row);
    for (const value of Object.values(row)) {
      const key = normalize(value);
      if (key && !reverse.has(key)) reverse.set(key,source);
    }
  });

  const sourceFrom = (...candidates) => {
    for (const candidate of candidates) {
      if (typeof candidate !== 'string') continue;
      const normalized = normalize(candidate);
      if (!normalized) continue;
      if (translations.has(normalized)) return normalized;
      const reversed = reverse.get(normalized);
      if (reversed) return reversed;
    }
    return null;
  };

  const translate = (source,language) => {
    const row = translations.get(source);
    if (!row) return null;
    return language === 'ru' ? source : row[language] || null;
  };

  const excluded = element => Boolean(element?.closest?.(
    'script,style,noscript,template,svg,.language-switcher,.locale-v9-layer,.matrix-language-transition'
  ));

  const applyTextNode = (node,language) => {
    const parent = node.parentElement;
    if (!parent || excluded(parent)) return;
    const raw = node.nodeValue || '';
    const match = raw.match(/^(\s*)(.*?)(\s*)$/s);
    if (!match || !match[2]) return;

    const source = sourceFrom(
      node.__tworkCompleteSource,
      node.__tworkI18nKey,
      node.__tworkExtraKey,
      node.__tworkV4Source,
      match[2]
    );
    if (!source) return;

    const nextValue = translate(source,language);
    if (!nextValue) return;

    node.__tworkCompleteSource = source;
    node.__tworkV4Source = source;
    const next = `${match[1]}${nextValue}${match[3]}`;
    if (raw !== next) node.nodeValue = next;
  };

  const translatedAttributes = ['placeholder','aria-label','title','alt'];
  const applyAttributes = (element,language) => {
    if (excluded(element)) return;
    const sources = element.__tworkCompleteAttributeSources || {};

    for (const attribute of translatedAttributes) {
      if (!element.hasAttribute(attribute)) continue;
      const raw = element.getAttribute(attribute) || '';
      const source = sourceFrom(sources[attribute],raw);
      if (!source) continue;
      const next = translate(source,language);
      if (!next) continue;
      sources[attribute] = source;
      if (raw !== next) element.setAttribute(attribute,next);
    }

    element.__tworkCompleteAttributeSources = sources;
  };

  const applySubtree = (root,language) => {
    if (!root) return;

    if (root.nodeType === Node.TEXT_NODE) {
      applyTextNode(root,language);
      return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;

    if (root.nodeType === Node.ELEMENT_NODE) applyAttributes(root,language);
    const walker = document.createTreeWalker(root,NodeFilter.SHOW_ALL,{
      acceptNode(node) {
        if (node.nodeType === Node.TEXT_NODE) return NodeFilter.FILTER_ACCEPT;
        if (node.nodeType === Node.ELEMENT_NODE) return excluded(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_SKIP;
      }
    });

    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE) applyTextNode(node,language);
      else if (node.nodeType === Node.ELEMENT_NODE) applyAttributes(node,language);
    }
  };

  const metadataSources = new WeakMap();
  const applyMetadata = language => {
    const titleSource = sourceFrom(document.__tworkCompleteTitleSource,document.title);
    if (titleSource) {
      document.__tworkCompleteTitleSource = titleSource;
      const next = translate(titleSource,language);
      if (next && document.title !== next) document.title = next;
    }

    for (const selector of ['meta[name="description"]','meta[property="og:title"]','meta[property="og:description"]']) {
      const meta = document.querySelector(selector);
      if (!meta) continue;
      const source = sourceFrom(metadataSources.get(meta),meta.content);
      if (!source) continue;
      metadataSources.set(meta,source);
      const next = translate(source,language);
      if (next && meta.content !== next) meta.content = next;
    }
  };

  const countResidual = language => {
    if (language === 'ru' || language === 'uk') {
      document.documentElement.dataset.i18nResidual = '0';
      return;
    }
    let count = 0;
    const walker = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!excluded(node.parentElement) && /[\u0400-\u052f]/u.test(node.nodeValue || '')) count += 1;
    }
    document.documentElement.dataset.i18nResidual = String(count);
  };

  let applying = false;
  let scheduled = false;
  const run = (language = currentLanguage(),root = document.body) => {
    if (applying || !document.body) return;
    applying = true;
    try {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      applySubtree(root,language);
      if (root === document.body || root === document.documentElement || root === document) applyMetadata(language);
      countResidual(language);
    } finally {
      applying = false;
    }
  };

  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      run();
    });
  };

  window.TWORK_I18N_COMPLETE = (language = currentLanguage(),root = document.body) => run(language,root);

  const boot = () => {
    run();
    window.setTimeout(() => run(),100);
    window.setTimeout(() => run(),320);
    window.setTimeout(() => run(),760);

    new MutationObserver(mutations => {
      if (applying) return;
      let needsRun = false;
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.target === document.documentElement) {
          needsRun = true;
          break;
        }
        if (mutation.type === 'characterData' || mutation.type === 'childList' || mutation.type === 'attributes') {
          needsRun = true;
          break;
        }
      }
      if (needsRun) schedule();
    }).observe(document.documentElement,{
      subtree:true,
      childList:true,
      characterData:true,
      attributes:true,
      attributeFilter:['data-site-language','lang','dir','placeholder','aria-label','title','alt']
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
