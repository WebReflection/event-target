/*! (c) 2017 Andrea Giammarchi (ISC) */ var EventTarget = 
(function (cache, modules) {
  function require(i) {
    return cache[i] || get(i);
  }
  function get(i) {
    var exports = {},
        module = { exports: exports };
    modules[i].call(exports, window, require, module, exports);
    return cache[i] = module.exports;
  }
  require.E = function (exports) {
    return Object.defineProperty(exports, '__esModule', { value: true });
  };
  var main = require(0);
  return main.__esModule ? main.default : main;
})([], [function (global, require, module, exports) {
  // main.js
  'use strict';

  var _require = require(1),
      findIndex = _require.findIndex,
      WeakMap = _require.WeakMap;

  require.E(exports).default = global.EventTarget || function () {

    // no need to transpile here, it's a very simple class
    function EventTarget() {}

    // EventTarget "class" definition
    define(EventTarget.prototype, {
      addEventListener: addEventListener,
      dispatchEvent: dispatchEvent,
      removeEventListener: removeEventListener
    });

    // used to relate instances to listeners
    var wm = new WeakMap();

    // get listeners or relate them once to the instance
    var get = function get(self) {
      return wm.get(self) || set(self);
    };
    var set = function set(self) {
      var dictionary = new Null();
      wm.set(self, dictionary);
      return dictionary;
    };

    // define values as configurable
    function define(where, what) {
      for (var key in what) {
        Object.defineProperty(where, key, {
          configurable: true,
          value: what[key]
        });
      }
    };

    // dispatch event for each listener
    function dispatch(info) {
      var options = info.options;
      if (options && options.once) {
        removeEventListener.call(info.target, this.type, info.listener, info.options);
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
      var secret = get(this);
      var listeners = secret[type] || (secret[type] = []);
      if (findIndex.call(listeners, registered, listener) < 0) {
        listeners.push({ target: this, listener: listener, options: options });
      }
    }

    function dispatchEvent(event) {
      var secret = get(this);
      var listeners = secret[event.type];
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
      var secret = get(this);
      var listeners = secret[type];
      if (listeners) {
        var i = findIndex.call(listeners, registered, listener);
        if (-1 < i) listeners.splice(i, 1);
      }
    }

    // private "class"
    function Null() {}
    Null.prototype = Object.create(null);

    return EventTarget;
  }();
}, function (global, require, module, exports) {
  // poorlyfills.js
  'use strict';

  var UID = '__event-target__' + Math.random();

  var findIndex = [].findIndex || function (callback, context) {
    var i = this.length;
    while (i--) {
      if (callback.call(context, this[i])) return i;
    }return i;
  };
  exports.findIndex = findIndex;

  var WeakMap = global.WeakMap || function WeakMap() {
    return {
      get: function get(obj) {
        return obj[UID];
      },
      set: function set(obj, value) {
        Object.defineProperty(obj, UID, {
          configurable: true,
          value: value
        });
      }
    };
  };
  exports.WeakMap = WeakMap;
}]);

