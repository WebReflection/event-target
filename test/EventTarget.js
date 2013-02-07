//remove:
var EventTarget = require("../build/event-target.node.js");
//:remove

wru.test([
  {
    name: "basic",
    test: function () {
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

