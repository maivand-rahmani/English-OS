# Visual Direction

## Purpose

This document defines the known visual and motion direction for English OS.

The V1 desktop shell and Dashboard frame are anchored to the supplied dashboard
reference.

Future implementation should refine colors, content, typography, and responsive
behavior without drifting away from the reference's shell grammar and first-glance
feeling.

## Current Direction

English OS should visually feel like:

- a beautiful study operating system
- a premium productivity tool
- an intelligent dashboard
- a calm but dynamic control center
- a soft, tactile, animated workspace

The canonical visual style is [Soft Liquid OS](./style-doctrine.md).

## Reference-Informed Structure

The supplied dashboard reference defines this desktop shell direction:

- full-page atmospheric pastel background
- large centered rounded app canvas
- calm shell framing with a strong brand anchor
- top-centered pill navigation
- right-side utility controls
- card-based content inside a single app canvas
- black active states for selected controls and primary actions

For desktop V1, this is not optional styling inspiration.

It is the expected shell and Dashboard frame.

Other learner-facing pages should borrow the shell, surfaces, navigation, and
interaction feel without being forced into the same wide-left plus narrow-right
Dashboard composition.

## Desktop Dashboard Frame

The desktop dashboard should follow this composition:

- atmospheric background outside the product shell
- large rounded app canvas with generous margin
- centered pill navigation at the top
- right utility controls
- large greeting/title row
- main content area split into a wide left area and narrower right column
- wide primary intelligence/progress panel on the left
- stacked recommendation/resource cards on the right
- two or three secondary cards below the primary panel

The page should feel like the reference at a glance.

If the screen looks like a normal admin template, generic dashboard, or default shadcn page, it is wrong.

## Minimalist Control Center Rule

Minimalism is required.

English OS should not show every possible metric just because the data exists.

Good screens should have:

- one dominant visual focus
- two to four supporting modules
- short text
- obvious next action
- calm whitespace
- strong hierarchy

Bad screens have:

- too many equal cards
- too many colors
- too many borders
- too many competing charts
- long explanatory text
- random decorative widgets
- unclear next action

The product should feel like a premium control center, not an analytics landfill.

Non-dashboard pages should avoid being broken into a stack of separate header,
recommendation, filter, results, sidebar, and status containers.

## Motion-Led Interface

Animation should be part of the style foundation.

The interface should not only look good in static screenshots. It should feel good while changing.

Important motion moments:

- app shell transitions
- dashboard widgets entering
- today plan updating
- progress changing
- roadmap blocks opening
- resource completion state changing
- AI feedback appearing
- review queue reprioritizing
- top navigation active pill transitions
- chart and progress value changes
- right panel content changes

## Surface Direction

Surfaces should feel:

- soft
- layered
- luminous
- rounded
- clean
- tactile

The UI can use glass-like and soft-card treatments, but must keep enough contrast and structure for daily use.

## Theme Direction

The visual style must be token-based.

The product should be able to change:

- color theme
- font family
- text scale
- surface intensity
- radius scale
- motion intensity
- dashboard density

This is important because English OS should feel product-oriented and user-configurable, not locked into one hardcoded look.

The reference style can become the default theme, but it should not be the only possible theme.

## Layout Density

The Dashboard should be dense enough to feel like a control center.

It should not become a sparse landing page.

It also should not become overloaded.

Good Dashboard density:

- several panels visible at once
- one dominant workspace area
- secondary right column for recommendations or context
- compact navigation controls
- strong visual hierarchy

Maximum useful Dashboard density:

- one primary panel
- one right-side column
- two or three secondary panels
- one clear primary action path

Anything beyond that should be justified by learner value.

## Responsive Direction

English OS must be designed for both desktop browser and mobile web from the beginning.

Desktop direction:

- wide app-canvas experience
- persistent top navigation
- no active per-section sidebar in V1
- multi-panel dashboard
- right contextual panels when useful
- richer charts and progress surfaces

Mobile direction:

- focused single-column workflows
- compact top navigation or section switcher
- bottom or collapsible navigation where needed
- cards stacked by priority
- fewer simultaneous panels
- same theme, typography, radius, surface, and motion tokens

The mobile version should not feel like a stripped-down afterthought.

It should feel like English OS in pocket form: calmer, more sequential, and easier to use in short study sessions.

## Reference Handling

When reference images are added later, this document should capture:

- what to borrow
- what to avoid
- layout patterns
- typography direction
- color direction
- motion implications
- dashboard density level

References should guide style, not override product usability.

## Visual Guardrails

Avoid:

- drifting away from the canonical reference frame
- making desktop V1 look unrelated to the supplied reference
- default shadcn look
- generic SaaS dashboard blandness
- childish edtech styling
- noisy gamification
- oversized marketing hero patterns inside the app
- purely decorative motion with no product meaning
- overloaded dashboards with no visual discipline

## Remaining Visual Decisions

The structural frame is decided.

These details can still be refined during implementation:

- color palette
- typography pairing
- dashboard density
- surface treatment
- icon style
- animation rhythm
- dark/light direction
- final component styling

Current leaning:

- canonical desktop frame should closely follow the supplied dashboard reference
- soft pastel atmosphere is acceptable, but colors may become more elegant
- black active states are desirable
- rounded app-shell canvas is desirable
- animation should be central
- default typography should be modern, serious, rounded, and highly readable
- exact palette values should be finalized during implementation through tokens

## Status

Active, Soft Liquid OS selected.

## Related Docs

- [Design Principles](./design-principles.md)
- [Style Doctrine](./style-doctrine.md)
- [Motion Direction](./motion-direction.md)
- [Theme System](./theme-system.md)
- [Reference Notes](./reference-notes.md)
- [Layout Principles](../ux/layout-principles.md)
- [Navigation](../ux/navigation.md)
- [Frontend Architecture](../engineering/frontend-architecture.md)
