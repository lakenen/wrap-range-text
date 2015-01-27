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

Returns an array of wrapper Elements.

```js
var wrapRange = require('wrap-range-text')

var wrapper = document.createElement('span')
wrapper.classList.add('fancy-text')

var range = document.createRange()
range.selectNodeContents(document.body)

var wrappedNodes = wrapRange(wrapper, range)
```

## License

([The MIT License](LICENSE))

Copyright 2015 Cameron Lakenen
