var cjs = require.resolve('../cjs');
var base = require('path').dirname(cjs);

global.tressa = require('tressa');
global.Event = require('basichtml').Event;

global.Array.prototype.findIndex = null;
global.WeakMap = null;

global.EventTarget = require('../cjs').default;

require('./test.js');

// this should cover the window case
Object.keys(require.cache).forEach(key => {
  if (key.indexOf(base) === 0) {
    delete require.cache[key];
  }
});
var asked = 0;
Object.defineProperty((global.window = global), 'global', {
  get: () => asked++ ? window : void 0
});
require('../cjs');
