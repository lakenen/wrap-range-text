# wrap-range-text

Safely wrap all selected text contained within a DOM Range.

## Installation

```
npm install wrap-range-text
```

## Usage

`wrapRange([wrapperEl, [range]])`

### Arguments

* `wrapperEl` - (optional) a DOM `Element` or `string` tag name used to wrap each text node (this element will be cloned for each node). *Default: `'span'`*.
* `range` - a DOM `Range` object.  *Default: the current selection (`document.getSelection().getRangeAt(0)`)*.


### Returns

`wrapRange` returns an object with the following properties:

* `nodes` - an array of wrapper Nodes
* `unwrap` - a function that unwraps the text when called


```js
var wrapRange = require('wrap-range-text')

var wrapper = document.createElement('span')
wrapper.classList.add('fancy-text')

var range = document.createRange()
range.selectNodeContents(document.body)

var wrap = wrapRange(wrapper, range)
// nodes should be wrapped with `span.fancy-text` elements
wrap.unwrap()
// nodes should be unwrapped

```

## License

([The MIT License](LICENSE))

Copyright 2015 Cameron Lakenen
