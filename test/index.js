var tape = require('tape')
  , wrapRange = require('..')

var html = '<p>hello, <span class="notempty">world</span><span class="empty"></span>!</p>'

function create(tag) {
  return document.createElement(tag)
}

function remove(el) {
  el.parentNode.removeChild(el)
}

function insert(el, container) {
  container = container || document.documentElement
  container.appendChild(el)
}

function setup(fn) {
  var el = create('div')
  el.innerHTML = html
  insert(el)

  function teardown() {
    remove(el)
  }

  return function (t) {
    fn(t, el)
    teardown()
  }
}


function test(msg, fn) {
  tape(msg, setup(fn))
}

test('should wrap a text node correctly', function (t, el) {
  var range = document.createRange()
    , wrapper = create('i')
    , textNode
    , wrap

  textNode = el.querySelector('p').firstChild

  range.setStart(textNode, 1)
  range.setEnd(textNode, 4)

  wrap = wrapRange(wrapper, range)

  t.equal(wrap.nodes.length, 1)
  t.equal(wrap.nodes[0].tagName.toLowerCase(), 'i')
  t.equal(el.querySelector('i').textContent, 'ell')
  t.end()
})

test('should unwrap a text node correctly', function (t, el) {
  var range = document.createRange()
    , wrapper = create('i')
    , textNode
    , wrap

  textNode = el.querySelector('p').firstChild

  range.setStart(textNode, 1)
  range.setEnd(textNode, 4)

  wrap = wrapRange(wrapper, range)

  t.equal(wrap.nodes.length, 1)
  t.ok(!!el.querySelector('i'), 'wrapper should exist')

  wrap.unwrap()

  t.ok(!el.querySelector('i'), 'wrapper should not exist')
  t.equal(el.innerHTML, html)
  t.end()
})

test('should wrap multiple nodes correctly', function (t, el) {
  var range = document.createRange()
    , wrapper = create('i')
    , textNode
    , span
    , wrap

  textNode = el.querySelector('p').firstChild
  span = el.querySelector('span.notempty')

  range.setStart(textNode, 1)
  range.setEnd(span, 1)

  wrap = wrapRange(wrapper, range)
  t.equal(wrap.nodes.length, 2)
  t.end()
})

test('should unwrap multiple nodes correctly', function (t, el) {
  var range = document.createRange()
    , wrapper = create('i')
    , wrap

  range.selectNodeContents(el.querySelector('p'))

  wrap = wrapRange(wrapper, range)
  wrap.unwrap()

  t.ok(!el.querySelector('i'), 'wrappers should not exist')
  t.end()
})

test('should not wrap empty text nodes', function (t, el) {
  var range = document.createRange()
    , wrapper = create('i')
    , wrap

  range.selectNodeContents(el.querySelector('p'))
  wrap = wrapRange(wrapper, range)

  t.ok(!el.querySelector('span.empty i'), 'empty node should not be wrapped')
  t.end()
})
