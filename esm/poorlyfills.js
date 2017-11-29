const UID = '__event-target__' + Math.random();

export const G = typeof global === typeof null ? global : window;

export const defineProperty = Object.defineProperty;

export const findIndex = [].findIndex || function (callback, context) {
  let i = this.length;
  while (i--) if (callback.call(context, this[i])) return i;
  return i;
};

export const WeakMap = G.WeakMap || function WeakMap() {
  return {
    get(obj) { return obj[UID]; },
    set(obj, value) {
      defineProperty(obj, UID, {
        configurable: true,
        value
      });
    }
  };
};