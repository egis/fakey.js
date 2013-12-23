/*
 * test/utils.js:
 *
 * (C) 2013 First Opinion
 * MIT LICENCE
 *
 */ 

define([
  'proclaim',
  'fakey',
  'utils'
], function (assert, fakey, utils) {


// Need to store init state so we can reset after each test
var content = document.getElementById('test-content'),
    contentHTML = content.innerHTML;

// Cross browser helper for adding event listeners
var addListener = function (el, evt, handler) {
  return (typeof el.addEventListener !== "undefined")
    ? el.addEventListener(evt, handler, false)
    : el.attachEvent('on' + evt, handler);
};

// Cross browser helper for preventDefault
var preventDefault = function (evt) {
  return (evt.preventDefault) ? evt.preventDefault() : (evt.returnValue = false);
};

// Cache lookup
var el;

//
// Set properly execute key method
//
var testKey = function () {
  it('Should fire a keydown evt', function (done) {
    addListener(el, 'keydown', function (evt) {
      done();
    });
    fakey.key(el, 'a');
  });
  it('Should break chain if preventDefault called on keydown', function () {
    addListener(el, 'keydown', function (evt) {
      preventDefault(evt);
    });
    addListener(el, 'keypress', function (evt) {
      assert.fail();
    });
    fakey.key(el, 'a');
  });
  it('Should fire a keypress evt', function (done) {
    addListener(el, 'keypress', function (evt) {
      done();
    });
    fakey.key(el, 'a');
  });
  it('Should break chain if preventDefault called on keypress', function () {
    addListener(el, 'keypress', function (evt) {
      preventDefault(evt);
    });
    addListener(el, 'input', function (evt) {
      assert.fail();
    });
    fakey.key(el, 'a');
  });
  it('Should fire an input evt if browser supports', function (done) {
    // Exit if we appear to be an IE browser < 9
    if (typeof el.addEventListener == "undefined") { return done(); }
    addListener(el, 'input', function (evt) {
      done();
    });
    fakey.key(el, 'a');
  });
  it('Should fire a keyup evt', function (done) {
    addListener(el, 'keyup', function (evt) {
      done();
    });
    fakey.key(el, 'a');
  });
  it('Should update caret position', function () {
    fakey.key(el, 'a');
    assert.equal(utils.getSel(el).begin, 1);
  });
  it('Should add key character', function () {
    fakey.key(el, 'a');
    assert.equal(el.value, 'a');
  });
  it('Should add key n times', function (done) {
    fakey.key(el, 'a', 4, function () {
      assert.equal(el.value, 'aaaa');
      done();
    });
  });
  it('Should handle symbols', function () {
    fakey.key(el, '@');
    assert.equal(el.value, '@');
  });
};

//
// Set properly execute key method
//
var testStr = function () {
  it('Should add multiple characters', function (done) {
    fakey.str(el, 'abc def', function () {
      assert.equal(el.value, 'abc def');
      done();
    });
  });
  it('Should add multiple characters n times', function (done) {
    fakey.str(el, '42', 2, function () {
      assert.equal(el.value, '4242');
      done();
    });
  });
};

//
// Set properly execute key method
//
var testSeq = function () {
  it('Should add key', function (done) {
    fakey.seq(el, [
        { key: 'a' }
    ], function () {
      assert.equal(el.value, 'a');
      done();
    });
  });
  it('Should add str', function (done) {
    fakey.seq(el, [
        { str: 'abc' }
    ], function () {
      assert.equal(el.value, 'abc');
      done();
    });
  });
  it('Should handle count', function (done) {
    fakey.seq(el, [
        { key: 'a', count: 4 }
    ], function () {
      assert.equal(el.value, 'aaaa');
      done();
    });
  });
  it('Should add items in seq', function (done) {
    fakey.seq(el, [
        { key: 'a' },
        { str: 'bcd' },
        { key: 'backspace' }
    ], function () {
      assert.equal(el.value, 'abc');
      done();
    });
  });
};

// test please
describe('ui', function () {
  // Reset HTML
  beforeEach(function () {
    el = document.forms[0]['test'];
  });

  // Reset HTML
  afterEach(function () {
    content.innerHTML = contentHTML;
    curPos = 0;
  });

  // Tests
  describe('key', testKey);
  describe('str', testStr);
  describe('seq', testSeq);
});


});