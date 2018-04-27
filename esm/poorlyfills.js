export const G = typeof global === typeof null ? global : self;

export const findIndex = [].findIndex || function (callback, context) {
  let i = this.length;
  while (i--) if (callback.call(context, this[i])) return i;
  return i;
};

export const defineProperty = Object.defineProperty;

// even if not unique each time, the used WeakMap
// is one and one only so it's not required to grant
// uniqueness per each instance. This is enough.
const UID = '__event-target__' + Math.random();
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
