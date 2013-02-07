//remove:
var EventTarget = require("../build/event-target.node.js");
//:remove

wru.test([
  {
    name: "basic",
    test: function () {
      function ET(){}
      ET.prototype = EventTarget;

      var et = new ET,
          evt, fn;
      et.addEventListener("init", fn = wru.async(function (e) {    
        wru.assert("right target", e.target === et);
        wru.assert("right event object", evt === e);
        wru.assert("right context", this === et);
        et.removeEventListener(e.type, fn);
        et.dispatchEvent(evt = {type:"init"});
        wru.assert("we are not in an infinite loop, right?", true);
        et.addEventListener("handleEvent", evt = {handleEvent: fn = wru.async(function (e) {
          wru.assert("right context", this === evt);
          wru.assert("right target", e.target === et);
          et.removeEventListener(e.type, this);
          et.dispatchEvent(e);
          wru.assert("we are not in an infinite loop, right?", true);
        })});
        et.dispatchEvent({type:"handleEvent"});
      }));
      et.dispatchEvent(evt = {type:"init"});
      
    }
  },
  {
    name: "basic ES5",
    test: function () {
      // this test works in ES5 only browsers
      if (!Object.defineProperty) return;
      function F(){}
      F.prototype = EventTarget;
      var et = new F,
          key, test, evt;
      for (key in et) {}
      wru.assert("there was no property to loop for", !key);
      et.addEventListener("test", test = wru.async(function (e) {
        this.removeEventListener("test", test);
        wru.assert("correct event object", evt === e);
        wru.assert("correct context", this === et);
        key = "inside";
      }));
      for (key in et) {}
      wru.assert("there is still no property to loop for", !key);
      et.dispatchEvent(evt = {type:"test"});
      key = "outside";
      et.dispatchEvent(evt = {type:"test"});
      wru.assert("it was removed", key === "outside");
    }
  }
]);

