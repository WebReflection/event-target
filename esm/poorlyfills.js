export const G = typeof global === typeof null ? global : self;

export const findIndex = [].findIndex || function (callback, context) {
  let i = this.length;
  while (i--) if (callback.call(context, this[i])) return i;
  return i;
};

export const defineProperty = Object.defineProperty;

let i = 0;
const UID = '__event-target__' + Math.random();
export const WeakMap = G.WeakMap || function WeakMap() {
  const UUID = UID + i++;
  return {
    get(obj) { return obj[UUID]; },
    set(obj, value) {
      defineProperty(obj, UUID, {
        configurable: true,
        value
      });
    }
  };
};
