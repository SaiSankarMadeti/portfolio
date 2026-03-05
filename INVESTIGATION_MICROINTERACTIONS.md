# Investigation: Button Micro-interactions Consistency

## Issue
The "Email Me" button in the Contact section shows a different micro-interaction effect compared to the other two buttons (LinkedIn, GitHub). All three use the same `.btn` and `.btn-primary`/`.btn-outline` classes, but the ripple or animation effect is inconsistent.

## Observations
- All three buttons are `<a>` tags styled as buttons.
- The ripple effect is implemented via a CSS pseudo-element (`.btn:active::after`) and a `ripple` keyframes animation.
- The effect should apply to all `.btn` elements, regardless of their context.
- The "Email Me" button uses `.btn.btn-primary.btn-lg`.
- The other two use `.btn.btn-outline.btn-lg`.

## Possible Causes
- The CSS selector for the ripple effect may not be specific enough or may be overridden by other styles.
- The stacking context or z-index of the pseudo-element may differ due to parent or sibling styles.
- The background or border of `.btn-primary` vs `.btn-outline` may visually mask the ripple.
- The browser may render the pseudo-element differently for mailto links.

## Next Steps
- Inspect the computed styles and DOM for all three buttons.
- Ensure `.btn:active::after` is present and animating for all.
- Adjust z-index, background, or animation as needed for consistency.
- Test in multiple browsers if needed.

## Proposed Fix (to be implemented next)
- Unify the ripple effect for all `.btn` variants by ensuring the pseudo-element is always visible above the button background, regardless of button type.
- If needed, add a JS-based ripple for more control.

---

## Final Solution

All CTAs now use the transparent outline style (.btn-outline) for a unified, minimal look. The ripple and micro-interaction effects are consistent across all buttons. CSS and HTML have been updated to ensure this consistency.

---

This file documents the investigation and the final solution for button micro-interaction consistency.