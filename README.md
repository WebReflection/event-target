event-target
============

A [W3C EventTarget](http://www.w3.org/wiki/DOM/domcore/EventTarget) Interface usable directly as JavaScript mixin.

### What
`EventTarget` is an object compatible with both ES3 and ES5 JS engines, suitable for old IE as latest version of node.js too.

The interface has 3 methods, so does `EventTarget`

  * `addEventListener(type:string, listener:function|object[, capture:boolean]):void` to add/subscribe a generic event listener, if not present already
  * `removeEventListener(type:string, listener:function|object[, capture:boolean]):void` to remove/unsubscribe a generic event listener, if already present
  * `dispatchEvent(event:object):void` to dispatch/notify all listeners

### How
The very first thing to understand is that `EventTarget` is an interface, a concept in JavaScript represented by objects, rather than constructors.
In fact, **EventTarget is not a function**, so any attempt to `new EventTarget` will fail.

```JavaScript
// retrieve the interface
var EventTarget = require('event-target');

// use it as mixin!
function MyNode() {}
MyNode.prototype.addEventListener = EventTarget.addEventListener;
MyNode.prototype.removeEventListener = EventTarget.removeEventListener;
MyNode.prototype.dispatchEvent = EventTarget.dispatchEvent;

var el = new MyNode;
el.addEventListener("test", function(evt){
  console.log("it works!");
});
el.dispatchEvent({type:"test"});
```

That's pretty much it :-)

Any object or prototype you want could use `EventTarget` methods, there's no need to initialize a thing, cool? What else could we do ? Well, we could, as example, simply borrow those methods when needed.

```JavaScript
var Emitter = (function(){

  var EventTarget = require('event-target'),
      addEventListener = EventTarget.addEventListener,
      removeEventListener = EventTarget.removeEventListener,
      dispatchEvent = EventTarget.dispatchEvent;

  function Emitter(){}
  
  Emitter.prototype = {
    on: function on(eventName, callMe) {
      addEventListener.call(this, eventName, callMe);
      return this;
    },
    off: function off(eventName, dontCallMe) {
      removeEventListener.call(this, eventName, dontCallMe);
      return this;
    },
    emit: function emit(eventName) {
      dispatchEvent.call(this, eventName);
      return this;
    }
  };

  return Emitter;

}());

var e = new Emitter;
e.on("custom:event", doStuff)
 .on("click", doExtraStuff)
 .off("whatever", dontBother)
 .emit("custom:event");

```

### Difference Between ES3 And ES5
Well, it's mainly about enumerability. By default all listeners are not enumerable in ES5 and all of them configurable. This is a god way to go so no extra object is needed, the instance is the EventTarget itself indeed. In ES3, if a `for/in` loop is really needed/necessary over the EventTarget object, and bear in mind you've never probably done a `for/in` with a DOM node, as example, or an Event emitter, be sure that properties starting with the chosen prefix, right now `"@@"`, should not be modified.

Same thing is valid for ES5 and `Object.getOwnPropertyNames(EventTarget)`, I believe it's a good practice to usually avoid dealing with anything that starts with `_` or `@` ... deal? Cool, now go and do amazing stuff :-)

### If You Want To Build Or Test This Project
In this case there are few things to do, from the project folder:

  * `make dependencies`
  * `make clean`
  * `make`

These steps are necessary to be able to build or to test, where to test, still in the same folder, just write `polpetta` then press *ctrl* over the link in console or just go in [localhost](http://localhost:1337/) and you should see in your browser a green page.

To test with node simply `make test` and you are ready to go.