# Layout Principles

## Purpose

This document defines global page-layout rules for English OS.

It exists to stop user-facing surfaces from drifting into heavy dashboard
compositions when the product actually needs a clearer primary experience model.

## Core Rule

Every English OS page should be designed around one primary experience model.

Examples:

- Dashboard = daily control center
- Roadmap = immersive roadmap
- Resources = cohesive curated discovery and library experience
- Writing = focused writing workspace
- Speaking = focused speaking workspace
- Review = focused review flow

Search, filters, recommendations, status, and actions may exist inside these
pages, but they should be visually integrated into the page's core experience.
They should not automatically become separate heavyweight page blocks.

## Forbidden Pattern: Stacked Dashboard Block Layout

English OS pages must not default to a stacked dashboard-block layout unless
the page is explicitly an analytics dashboard or an admin-style monitoring
surface.

### Forbidden layout pattern

- header block
- recommendation block
- search and filters block
- results block
- right sidebar insight block
- status or stat cards block
- nested cards inside nested cards

### Why it is forbidden

This pattern makes pages feel heavy, fragmented, administrative, and visually
cheap.

It creates competing containers instead of one coherent product experience.

It damages clarity, hierarchy, progressive disclosure, and premium feel.

### Especially forbidden for

- Resources page
- Roadmap page
- learner workspaces
- discovery pages
- practice pages
- any user-facing learner flow where calm focus matters more than dashboard
  density

### Allowed only when

The page is explicitly an analytics dashboard or admin-style monitoring view
and the stacked card layout is the correct information architecture.

This rule does not ban normal UI elements.

Small cards, tiles, rows, chips, compact callouts, inline summaries, and
context panels are still allowed when they support the primary experience
without taking over the page architecture.

## Resources Rule

The Resources page must not be a dashboard.

The Resources page must not use this fixed structure:

1. command center block
2. recommended now block
3. search and filters block
4. results block
5. right sidebar insight block
6. library status block

This structure is explicitly rejected.

The Resources page should feel like one cohesive curated discovery experience.

It should prefer:

- integrated search and discovery surfaces
- lightweight filters
- compact curated resource rows or tiles
- progressive disclosure
- large detail modal for deep resource context
- minimal visible complexity
- clean hierarchy
- premium editorial and product feel

It should avoid:

- many dark blocks stacked vertically
- large boxed sections competing for attention
- nested resource cards
- nested callout panels inside every card
- admin-dashboard visual structure
- over-explaining every resource on the main page

## Roadmap Rule

The Roadmap page itself is the roadmap.

Do not add hero-plus-dashboard-card stacks above or around it.

Do not turn the roadmap into a page with separate recommendation, status,
filter, and support blocks fighting the roadmap canvas for attention.

## Related Docs

- [Information Architecture](./information-architecture.md)
- [Resources](./resources.md)
- [Roadmap](./roadmap.md)
- [Frontend Architecture](../engineering/frontend-architecture.md)
- [Style Doctrine](../brand/style-doctrine.md)
