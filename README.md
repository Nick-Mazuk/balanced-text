# Balanced Text

A performance-optimized script for balancing text in browser. `text-wrap: balance` is in the CSS Text Module Level 4 draft. This JS script is a polyfill.

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

<script src='balance-text.js'></script>
```

The JS will only run if your browser does not support `text-wrap: balance`.

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
