# Style Doctrine

## Purpose

This document defines the canonical UI/UX style direction for English OS.

It should be treated as the source of truth for the product's visual and interaction style until a future decision replaces it.

## Style Name

Soft Liquid OS.

## One-Sentence Definition

English OS uses a Soft Liquid OS interface: a motion-led, token-based, glass-tactile productivity dashboard style with calm premium surfaces, strong black active states, customizable themes, and rich but purposeful animation.

## Canonical Reference Rule

The supplied dashboard reference is the canonical V1 desktop visual frame.

For desktop V1, the implementation should closely match the reference's:

- outer atmospheric background
- large rounded app canvas
- left vertical icon rail
- centered pill navigation
- right utility cluster
- large greeting area
- main two-column dashboard grid
- dominant large analytics/control panel
- stacked right-side recommendation cards
- lower secondary cards
- soft rounded panels
- black active states and primary actions
- minimal icon-led controls

This does not mean copying literal content, avatars, logo marks, or course-platform meaning.

It does mean the layout grammar, spacing logic, surface treatment, navigation shape, and first-glance feeling should be recognizably close to the reference.

If an implementation does not visually feel related to the reference at first glance, it is off-direction.

## Why This Style Fits English OS

English OS is a personal operating system for learning English.

The style must therefore feel:

- structured enough for daily study
- beautiful enough to create desire
- calm enough to reduce anxiety
- intelligent enough to support the product thesis
- animated enough to become memorable
- flexible enough to support user appearance settings

Soft Liquid OS supports this better than a plain SaaS dashboard, a childish edtech UI, or a generic course platform aesthetic.

## Style Ingredients

### Liquid Glass Influence

Use soft translucent surfaces, layered panels, blur, glow, and atmospheric depth.

This should be controlled and readable, not transparent for its own sake.

### Fluent-Like Depth

Use elevation, shadows, light, and layered surfaces to create hierarchy.

Depth should help the user understand focus, not decorate every object equally.

### Motion-Led Dashboard

Motion should be central to the experience.

The product should feel alive when:

- dashboard widgets enter
- navigation changes
- roadmap blocks open
- progress values update
- resource states change
- feedback appears

### Token-Based Themes

The style should be powered by CSS variables and design tokens.

The default style can be Soft Liquid OS, but the system must support future themes.

## Core Visual Rules

- Use a large rounded app canvas.
- Use a vertical icon sidebar.
- Use centered pill top navigation.
- Use black active states for selected controls and primary actions.
- Use soft glass-like panels and layered surfaces.
- Use a calm atmospheric background.
- Use a dense but breathable dashboard layout.
- Use right-side contextual panels where useful.
- Use charts, progress states, and learning signals as visual content.

## Minimalism And Information Discipline

Soft Liquid OS should be minimal, not empty.

The interface should feel premium because it is edited, calm, and intentional.

Rules:

- show fewer things, but make each thing useful
- prefer one dominant panel over many equal panels
- keep secondary cards quiet and compact
- avoid decorative widgets that do not change learner behavior
- use whitespace and soft surfaces to reduce anxiety
- use charts and progress only when they clarify what to do next
- keep copy short and directive
- do not overload the dashboard with analytics, badges, streaks, or random stats

The product should never become a noisy widget wall.

## Responsive Style Requirement

Soft Liquid OS must work as both:

- a desktop browser product
- a mobile web product

The style should not be designed only as a wide dashboard screenshot.

Desktop should feel like a calm command center with dense information, side navigation, and contextual panels.

Mobile should feel like the same operating system compressed into focused, swipe-friendly, single-task views.

Mobile must preserve:

- premium surfaces
- animation quality
- theme tokens
- readable typography
- clear next action
- roadmap and resource clarity

Mobile should adapt the shell instead of copying the desktop layout one-to-one.

## Typography Direction

Avoid childish education fonts.

Recommended direction:

- modern
- rounded but serious
- highly readable
- premium productivity feel

Good font candidates:

- Satoshi
- Geist
- Manrope
- Plus Jakarta Sans
- Avenir-like geometric sans

The font must be driven by tokens so it can be changed later.

## Color Direction

The default theme may use:

- soft pastel atmosphere
- warm off-white surfaces
- subtle pink/lilac/blue accents
- black active states
- strong readable text

Avoid making the product entirely pink, purple, beige, or one-note pastel.

The palette must be tokenized and themeable.

## Motion Direction

Motion should be abundant but controlled.

Use motion for:

- route transitions
- active navigation movement
- widget reveal
- progress updates
- roadmap expansion
- resource completion
- writing feedback reveal
- speaking waveform and transcript
- AI insight loading and reveal

Do not use motion as random decoration.

## What To Avoid

Avoid:

- overbuilt dashboards with too many competing widgets
- dense information without clear hierarchy
- pure glassmorphism with poor readability
- pure neumorphism
- childish gamified edtech visuals
- generic SaaS dashboard style
- default shadcn styling
- live-class platform feeling
- course marketplace feeling
- excessive social/chat emphasis
- hardcoded visual styles
- motion that slows down work

## Implementation Implications

The codebase should support this style through:

- semantic CSS variables
- theme data attributes
- motion tokens
- reusable motion primitives
- tokenized typography
- tokenized surface and elevation values
- local appearance preferences

## Status

Active.

## Related Docs

- [Design Principles](./design-principles.md)
- [Visual Direction](./visual-direction.md)
- [Motion Direction](./motion-direction.md)
- [Theme System](./theme-system.md)
- [Reference Notes](./reference-notes.md)
