'use strict';
const G = typeof global === typeof null ? global : self;
exports.G = G;

const findIndex = [].findIndex || function (callback, context) {
  let i = this.length;
  while (i--) if (callback.call(context, this[i])) return i;
  return i;
};
exports.findIndex = findIndex;

const defineProperty = Object.defineProperty;
exports.defineProperty = defineProperty;

// even if not unique each time, the used WeakMap
// is one and one only so it's not required to grant
// uniqueness per each instance. This is enough.
const UID = '__event-target__' + Math.random();
const WeakMap = G.WeakMap || function WeakMap() {
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
exports.WeakMap = WeakMap;
