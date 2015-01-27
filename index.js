
// return all text nodes that are contained within `el`
function getTextNodes(el) {
  el = el || document.body

  var doc = el.ownerDocument
    , walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false)
    , textNodes = []
    , node

  while (node = walker.nextNode()) {
    textNodes.push(node)
  }
  return textNodes
}

// return true if `rangeA` intersects `rangeB`
function rangesIntersect(rangeA, rangeB) {
  return rangeA.compareBoundaryPoints(Range.END_TO_START, rangeB) === -1 &&
    rangeA.compareBoundaryPoints(Range.START_TO_END, rangeB) === 1
}

// create and return a range that selects `node`
function createRangeFromNode(node) {
  var range = node.ownerDocument.createRange()
  try {
    range.selectNode(node)
  } catch (e) {
    range.selectNodeContents(node)
  }
  return range
}

// return true if `node` is fully or partially selected by `range`
function rangeIntersectsNode(range, node) {
  if (range.intersectsNode) {
    return range.intersectsNode(node)
  } else {
    return rangesIntersect(range, createRangeFromNode(node))
  }
}

// return all text nodes fully or partially selected by `range`
function getRangeTextNodes(range) {
  var nodes = getTextNodes(range.commonAncestorContainer)

  return nodes.filter(function (node) {
    return rangeIntersectsNode(range, node)
  })
}

function wrapRangeText(wrapperEl, range) {
  var startNode
    , endNode
    , startOffset
    , endOffset
    , nodes

  if (typeof range === 'undefined') {
    // get the current selection if no range is specified
    range = window.getSelection().getRangeAt(0)
  }

  if (range.isCollapsed) {
    // nothing to wrap
    return []
  }

  if (typeof wrapperEl === 'undefined') {
    wrapperEl = 'span'
  }

  if (typeof wrapperEl === 'string') {
    // assume it's a tagname
    wrapperEl = document.createElement(wrapperEl)
  }

  startNode = range.startContainer
  endNode = range.endContainer
  startOffset = range.startOffset
  endOffset = range.endOffset

  nodes = getRangeTextNodes(range).map(function (node) {
    var currentRange = document.createRange()
      , currentWrapper = wrapperEl.cloneNode()

    currentRange.selectNodeContents(node)

    if (node === startNode && startNode.nodeType === 3) {
      currentRange.setStart(node, startOffset)
      startNode = currentWrapper
      startOffset = 0
    }
    if (node === endNode && endNode.nodeType === 3) {
      currentRange.setEnd(node, endOffset)
      endNode = currentWrapper
      endOffset = 1
    }

    currentRange.surroundContents(currentWrapper)
    return currentWrapper
  })

  return nodes
}


function remove(el) {
  if (el.parentNode) {
    el.parentNode.removeChild(el)
  }
}

function replaceNode(replacement, node) {
  remove(replacement)
  node.parentNode.insertBefore(replacement, node)
  remove(node)
}

function unwrap(el) {
  var range = document.createRange()
  range.selectNodeContents(el)
  replaceNode(range.extractContents(), el)
}

function undo(nodes) {
  nodes.forEach(unwrap)
}

module.exports = wrapRangeText
module.exports.undo = undo
