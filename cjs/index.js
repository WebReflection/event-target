'use strict';
const {defineProperty, findIndex, G, WeakMap} = require('./poorlyfills.js');

let EventTarget = G.EventTarget;

try {
  new EventTarget;
} catch(e) {
  EventTarget = (() => {

    // used to relate instances to listeners
    const wm = new WeakMap;

    // get listeners or relate them once to the instance
    const get = self => wm.get(self) || set(self);
    const set = self => {
      const dictionary = new Null;
      wm.set(self, dictionary);
      return dictionary;
    };

    // define values as configurable
    const define = (where, what) => {
      for (const key in what) {
        defineProperty(where, key, {
          configurable: true,
          value: what[key]
        });
      }
    };

    // no need to transpile here, it's a very simple class
    function EventTarget() {}

    // EventTarget "class" definition
    define(
      EventTarget.prototype,
      {
        addEventListener,
        dispatchEvent,
        removeEventListener
      }
    );

    // dispatch event for each listener
    function dispatch(info) {
      const options = info.options;
      if (options && options.once) {
        removeEventListener.call(
          info.target,
          this.type, info.listener, info.options
        );
      }
      if (typeof info.listener === 'function') {
        info.listener.call(info.target, this);
      } else {
        info.listener.handleEvent(this);
      }
    }

    // search for a registered listener
    function registered(info) {
      return this === info.listener;
    }

    // public methods
    function addEventListener(type, listener, options) {
      const secret = get(this);
      const listeners = secret[type] || (secret[type] = []);
      if (findIndex.call(listeners, registered, listener) < 0) {
        listeners.push({target: this, listener, options});
      }
    }

    function dispatchEvent(event) {
      const secret = get(this);
      const listeners = secret[event.type];
      if (listeners) {
        define(event, {
          currentTarget: this,
          target: this
        });
        listeners.forEach(dispatch, event);
        delete event.currentTarget;
        delete event.target;
      }
      return true;
    }

    // used both as public and private method,
    // to avoid method pollution/interception of private listeners
    function removeEventListener(type, listener, options) {
      const secret = get(this);
      const listeners = secret[type];
      if (listeners) {
        const i = findIndex.call(listeners, registered, listener);
        if (-1 < i) listeners.splice(i, 1);
      }
    }

    // private "class"
    function Null() {}
    Null.prototype = Object.create(null);

    return EventTarget;

  })();
}

Object.defineProperty(exports, '__esModule', {value: true}).default = EventTarget;
