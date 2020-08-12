# Balanced Text

<!-- ![Github](https://img.shields.io/github/v/release/nick-mazuk/balanced-text?logo=Github&style=flat-square) -->
[![npm](https://img.shields.io/npm/v/balanced-text.svg?style=flat-square)][npm-link]
[![npm](https://img.shields.io/npm/dm/balanced-text.svg?style=flat-square)][npm-link]
[![jsdeliver](https://data.jsdelivr.com/v1/package/npm/balanced-text/badge)](https://www.jsdelivr.com/package/npm/balanced-text)

A performance-optimized script for balancing text in browser. `text-wrap: balance` is in the CSS Text Module Level 4 draft. This JS script is a polyfill and is dependency-free.

Initial benchmarks are faster than both Adobe's and NY Time's polyfills.

[Demo](https://nickmazuk.com/balanced-text/)

## Quick Install

`npm i balanced-text`

### Import

After installation, you can import the JS file into your project using this snippet:

`import { balanceText } from 'balanced-text'`

Then run:

`balanceText()`

### HTML

```html
<element class='has-text-balanced'>Lorem…</element>
```

### CSS (optional)

```css
/* For when the CSS spec is available */
.has-text-balanced {
    text-wrap: balance;
}
```

*The JS will only run if your browser does not support `text-wrap: balance`.*

### CDN (Alternative)

[https://www.jsdelivr.com/package/npm/balanced-text](https://www.jsdelivr.com/package/npm/balanced-text)

```html
<script src='https://cdn.jsdelivr.net/npm/balanced-text@latest/balance-text.min.js'>
    balanceText()
</script>

```

## Options

Options are passed as an optional object.

```js
balanceText({
    elements: '.has-text-balanced',
    watch: true,
    debounce: 200,
    lazyBalance: false,
    disableWait: true
})
```

### Elements

Change which elements are balanced.

- Type: `String`
- Default: `'.has-text-balanced'`

`balanceText({ elements: '.balance-text' })`

Any string that works with `document.querySelectorAll()` is valid.

### Watch

If the window is resized, rebalance the text.

- Type: `Boolean`
- Default: `false`

`balanceText({ watch: true })`

### Debounce

When `watch: true`, `balanceText` is debounced by default. That reduces jank whenever the window is resized. Use debounce to change the timing.

- Type: `Integer` (milliseconds)
- Default: `200`

`balanceText({ debounce: 200 })`

Set debounce to `0` to eliminate it.

### Lazy Balance

If you have many elements on your page that need balanced text, consider enabling lazy balancing.

When set to true, `balanceText` will only affect visible elements. Using `IntersectionObserver`, text will be automatically balanced when it enters the viewport. Because `balanceText` is fast, it should not introduce scroll jank.

- Type: `Boolean`
- Default: `false`

`balanceText({ lazyBalance: true })`

### Disable Wait

By default, `balanceText` waits until the main thread is idle (see [Timing](#timing)). Enabling this option will make `balanceText` run as soon as possible. It may become render blocking. However, it can prevent the "flash" of unbalanced text.

- Type: `Boolean`
- Default: `False`

`balanceText({ disableWait: true })`

## How it works

1. Wraps every word in a span
2. Gets the width of every word and space
3. Calculates the average line length
4. Places a `br` tag where the line breaks should go

This limits many performance drawbacks of other algorithms.

## Limitations

This script does assume a few things about the HTML contents:

- The HTML elements only contain text (no sub elements, including `b`, `strong`, `a` tags). Will be fixed in future versions.
- The only line-break opportunities are spaces `' '`

## Timing

The script uses `requestIdleCallback` if available (~75% support). This reduces the likelihood that it interrupts important functions.

If not, it uses `requestAnimationFrame` to minimize the chances of dropping a frame.

`requestAnimationFrame` is always used during `lazyBalancing` to minimize scroll jank.

## Report Bug / Feature Request

[https://github.com/Nick-Mazuk/balanced-text/issues](https://github.com/Nick-Mazuk/balanced-text/issues)

## Copyright and license ![Github](https://img.shields.io/github/license/nick-mazuk/balanced-text?logo=Github&style=flat-square)

©2020 Nick Mazuk. Code released under [the MIT license](https://github.com/Nick-Mazuk/balanced-text/blob/master/LICENSE).

[npm-link]: https://www.npmjs.com/package/balanced-text
