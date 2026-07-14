# Inferno web companion map enlargement design

## Goal

Let readers enlarge the Inferno teaching map from 1× through 4× without obscuring the guide unnecessarily. The existing follow-scroll and collapse controls remain available.

## Interaction model

- The map controls include an accessible size selector with 1×, 2×, 3×, and 4× choices.
- At 1×, 2×, and 3× on desktop, the map stays in the right-hand panel. Increasing the selection widens that panel and correspondingly reduces the guide column, with no visual overlap.
- At 4×, the map opens in a centered modal overlay rather than making the normal reading layout unusably narrow.
- The overlay includes a close button, closes on Escape, and restores keyboard focus to the 4× control when closed.
- On mobile, the normal stacked guide/map layout remains. Size selections 1×–3× adjust the map within its available width; 4× continues to use the overlay.

## State and compatibility

- Persist the selected inline size (1×–3×) with guarded local storage, defaulting to 1×.
- The 4× overlay is temporary: it opens the modal but does not replace the saved inline preference.
- Follow-scroll and collapse preferences continue to work independently of map size.
- With JavaScript unavailable, the map remains visible at its existing default size and no control becomes required for reading the guide.

## Accessibility and motion

- Use native form controls or buttons with explicit labels and ARIA relationships where needed.
- Mark the overlay as a dialog, move focus into it when opened, restore focus on close, and provide both a visible Close control and Escape support.
- Prevent background interaction while the dialog is open without disturbing the document's normal reading order.
- Respect the existing reduced-motion rules; size and overlay changes do not require animation.

## Layout behavior

- The desktop layout gains size-specific classes or data attributes that adjust the grid's map-column width for 1×, 2×, and 3×.
- The guide column retains a sensible minimum width; if a viewport is too narrow for the selected inline size, responsive styling uses the stacked layout instead of overlap.
- The 4× overlay displays the existing map asset at the largest practical viewport-constrained size and permits the image to remain fully visible.

## Validation

- Add a red-green contract test for the selector, inline sizing hooks, overlay/dialog semantics, close affordance, and storage behavior.
- Extend stylesheet/script contract coverage for responsive sizing and reduced-motion compatibility.
- Run the complete web test suite, production build, and whitespace check before publishing.
