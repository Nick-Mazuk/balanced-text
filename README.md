# Balanced Text

A performance-optimized script for balancing text in browser. `text-wrap: balance` is in the CSS Text Module Level 4 draft. This JS script is a polyfill and is dependency-free.

Initial benchmarks are faster than both Adobe's and NY Time's polyfills.

## Install

`npm i balanced-text`

CSS:

```css
.has-balanced-text {
    text-wrap: balance;
}
```

HTML:

```html
<element class='has-balanced-text'>Lorem…</element>

<script src='balance-text.js'>
    balanceText()
</script>
```

The JS will only run if your browser does not support `text-wrap: balance`.

## Options

Options are passed as an optional object.

```js
balanceText({
    elements: '.has-balanced-text',
    watch: true,
    debounce: 200
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

## Report Bug / Feature Request

[https://github.com/Nick-Mazuk/balanced-text/issues](https://github.com/Nick-Mazuk/balanced-text/issues)
