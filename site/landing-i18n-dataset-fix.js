(() => {
  if (window.__TWORK_I18N_DATASET_FIX__) return;
  window.__TWORK_I18N_DATASET_FIX__ = true;

  const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'dataset');
  if (!descriptor?.get || descriptor.configurable === false) return;

  const proxies = new WeakMap();
  const normalizeKey = property => {
    if (typeof property !== 'string' || !property.includes('-')) return property;
    return property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  };

  Object.defineProperty(HTMLElement.prototype, 'dataset', {
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable,
    get() {
      const dataset = descriptor.get.call(this);
      let proxy = proxies.get(dataset);
      if (proxy) return proxy;

      proxy = new Proxy(dataset, {
        get(target, property) {
          return Reflect.get(target, normalizeKey(property), target);
        },
        set(target, property, value) {
          return Reflect.set(target, normalizeKey(property), value, target);
        },
        has(target, property) {
          return Reflect.has(target, normalizeKey(property));
        },
        deleteProperty(target, property) {
          return Reflect.deleteProperty(target, normalizeKey(property));
        },
        getOwnPropertyDescriptor(target, property) {
          return Reflect.getOwnPropertyDescriptor(target, normalizeKey(property));
        }
      });
      proxies.set(dataset, proxy);
      return proxy;
    }
  });
})();
