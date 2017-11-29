'use strict';
const UID = '__event-target__' + Math.random();

const G = typeof global === typeof null ? global : window;
exports.G = G;

const defineProperty = Object.defineProperty;
exports.defineProperty = defineProperty;

const findIndex = [].findIndex || function (callback, context) {
  let i = this.length;
  while (i--) if (callback.call(context, this[i])) return i;
  return i;
};
exports.findIndex = findIndex;

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