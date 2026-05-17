# Theme System

## Purpose

This document defines how English OS should support themes, style templates, typography changes, and user appearance settings.

The product should not hardcode its visual style directly into components.

## Core Principle

English OS should be built on design tokens and CSS variables.

The default theme should express the [Soft Liquid OS](./style-doctrine.md) direction.

The interface should be able to support:

- light theme
- dark theme
- future custom visual themes
- configurable font family
- configurable text scale
- configurable interface density
- configurable motion intensity

This makes the product more flexible, more product-oriented, and easier to evolve visually.

## Token Categories

The design system should define variables for:

- color
- background
- surface
- text
- border
- shadow
- radius
- spacing
- typography
- font family
- text scale
- motion duration
- motion easing
- motion intensity
- dashboard density

## CSS Variable Strategy

Use CSS variables as the runtime theme layer.

Examples:

```css
:root {
  --color-background: ...;
  --color-surface: ...;
  --color-text: ...;
  --font-sans: ...;
  --text-scale: 1;
  --radius-card: ...;
  --motion-duration-medium: ...;
}
```

Theme classes or data attributes can override these values:

```css
[data-theme="dark"] {
  --color-background: ...;
}

[data-density="compact"] {
  --dashboard-gap: ...;
}
```

## User Appearance Settings

Settings should eventually allow the learner to control:

- theme mode
- font family
- text size
- interface density
- motion intensity

Recommended initial options:

- theme: system, light, dark
- text size: small, default, large
- density: comfortable, compact
- motion: full, reduced

More advanced theme templates can be added later.

## Font Customization

Font choices should be driven by variables.

The app should avoid hardcoding a single font family throughout components.

Typography tokens should allow the product to change:

- primary interface font
- display font if used
- monospace font if needed
- text scale
- heading scale

## Motion Customization

Because English OS is motion-led, motion should also be tokenized.

Motion variables should control:

- duration
- easing
- stagger timing
- intensity
- reduced-motion alternatives

This allows the product to remain animation-rich while respecting user comfort.

## Implementation Requirements

When building UI:

- use semantic tokens instead of raw colors
- use font variables instead of hardcoded font stacks
- use radius variables instead of one-off radius values
- use motion variables instead of random durations
- use spacing/layout tokens for repeated patterns

Raw values are acceptable only for one-off layout constraints that are not part of the visual language.

## Storage Strategy

Appearance preferences should be stored locally first.

This fits the V1 client-first persistence direction.

Later, preferences can sync to the user's account.

## Status

Active.

## Related Docs

- [Design Principles](./design-principles.md)
- [Style Doctrine](./style-doctrine.md)
- [Visual Direction](./visual-direction.md)
- [Motion Direction](./motion-direction.md)
- [Settings UX](../ux/settings.md)
- [Frontend Architecture](../engineering/frontend-architecture.md)
