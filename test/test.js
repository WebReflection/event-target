tressa.title('EventTarget Class');

var et = new EventTarget();
et.dispatchEvent(new Event('phone'));

function noOp() { noOp.i++; }
noOp.i = 0;

et.addEventListener('phone', noOp);
et.addEventListener('phone', noOp);
et.addEventListener(
  'phone',
  function (home) {
    tressa.assert(home.type === 'phone', 'expected event type');
    tressa.assert(this === et, 'correct context');
    tressa.assert(this === home.target, 'correct target');
    tressa.assert(this === home.currentTarget, 'correct currentTarget');
  },
  {once: true}
);

et.dispatchEvent(new Event('phone'));

tressa.assert(noOp.i === 1, 'same listener is not added twice');

et.removeEventListener('phone', noOp);
et.removeEventListener('phone', noOp);

et.removeEventListener('nope', noOp);

var listener = {
  handleEvent: function (e) {
    tressa.assert(this === listener, 'handleEvent is also supported');
  }
};
et.addEventListener('yep', listener, {once: true});
et.dispatchEvent(new Event('yep'));
