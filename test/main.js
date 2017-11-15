global.tressa = require('tressa');
global.Event = require('basichtml').Event;

global.Array.prototype.findIndex = null;
global.WeakMap = null;

global.EventTarget = require('../cjs/main.js').default;

require('./test.js');
