# Frontend Architecture

## Purpose

This document defines the frontend architecture of English OS.

The frontend should feel like a serious operating system for learning English while remaining technically clean, fast, and easy to extend.

## Frontend Goals

The frontend should:

- implement the app shell cleanly
- keep navigation stable and predictable
- make dashboard, roadmap, resources, writing, and speaking feel connected
- avoid unnecessary backend requests
- support local-first progress interactions in V1
- keep UI composition separate from product logic

## App Shell

English OS should use a persistent authenticated app shell.

The shell should include:

- global top bar
- section-specific sidebar
- main content area
- user/account utility area

The shell should be implemented as a composed widget, not scattered across every page.

Recommended location:

```text
src/widgets/app-shell/
```

## Routing Model

Use Next.js App Router route groups:

```text
src/app/
├── (auth)/
├── (onboarding)/
└── (app)/
```

The authenticated app routes should map to the UX top-level sections:

- `/dashboard`
- `/roadmap`
- `/resources`
- `/writing`
- `/speaking`
- `/settings`

Route files should be thin and mostly compose widgets.

## Server And Client Component Strategy

Use server components for:

- initial route composition
- loading stable curated data
- reading authenticated user state where needed
- rendering mostly static or server-derived surfaces

Use client components for:

- interactive dashboard widgets
- local progress updates
- writing drafts
- speaking recording flows
- filters and controls
- browser persistence reads and writes

Client components should be deliberate. Do not make entire routes client components unless interaction requires it.

## Client-First Persistence

High-frequency learner state should be stored locally first in V1.

Examples:

- resource completion state
- roadmap block local state
- review item local state
- local learning events
- writing drafts
- lightweight practice history

Use:

- IndexedDB for structured local state and event queues
- localStorage only for tiny UI preferences
- in-memory React state only for temporary UI state

The UI should update immediately after local writes.

Server sync should be optional or batched, not required for every small interaction.

## Local Event Queue

Frontend actions should create local learning events.

Example flow:

1. learner marks a resource complete
2. UI writes the resource state locally
3. UI appends a `resource_completed` event to the local event queue
4. dashboard state updates from local state
5. future sync can send queued events to the server

This makes the product feel fast and keeps backend load low.

## State Model

Prefer this state hierarchy:

- URL state for navigation, filters, and shareable view state
- local component state for temporary interactions
- browser persistence for learner progress and drafts
- server state for auth, AI calls, curated content, and eventual sync

Do not introduce a global client state library until the product clearly needs one.

## Data Loading

Curated content such as roadmap templates and resources can be loaded from:

- static seed data during early builds
- server-loaded database data when the catalog becomes database-backed
- cached route-level loaders

Avoid loading the same resource catalog separately in every widget.

## UI Composition Rules

The frontend should follow the FSD structure:

- routes compose widgets
- widgets compose features and entities
- features implement user workflows
- entities provide domain-specific UI and model helpers
- shared contains primitives and utilities

Dashboard pages should compose widgets such as:

- app shell
- today plan
- best next resource
- review queue preview
- progress snapshot
- writing action card
- speaking action card

## Design System

Use shadcn/ui primitives as accessible building blocks.

English OS should still define its own:

- spacing rhythm
- layout patterns
- color tokens
- typography direction
- dashboard density rules
- interaction style

The product should not visually feel like a default shadcn demo.

The default visual direction should follow the Soft Liquid OS style doctrine.

## Responsive Architecture

The frontend should be built for desktop browser and mobile web from the first implementation pass.

Do not treat mobile as a late CSS patch.

Desktop layout should support:

- persistent app shell
- top navigation
- section sidebar
- multi-panel dashboards
- contextual right panels

Mobile layout should support:

- focused single-column flows
- compact or collapsible navigation
- touch-friendly controls
- prioritized dashboard cards
- reduced simultaneous visual density
- the same product tokens and motion language

Reusable widgets should expose layout variants when needed instead of duplicating product logic for desktop and mobile.

## Theme And Token System

All product styling should be driven by design tokens and CSS variables.

The app should support:

- light theme
- dark theme
- future theme templates
- configurable font family
- configurable text scale
- configurable interface density
- configurable motion intensity

Implementation expectations:

- define semantic CSS variables for colors and surfaces
- define font variables for interface and display typography
- define motion variables for duration, easing, and stagger
- define density variables for spacing and dashboard layout rhythm
- avoid hardcoding product-level visual decisions inside components

User appearance preferences should be stored locally first and applied through root-level attributes or classes.

Example:

```text
data-theme="dark"
data-text-size="large"
data-density="compact"
data-motion="reduced"
```

This keeps the style system flexible and makes future themes possible without rewriting components.

## Performance Principles

The frontend should:

- avoid backend requests for every learner click
- batch or defer sync work
- render from local state when possible
- cache stable curated data
- avoid unnecessary client-side hydration
- keep dashboard data loading predictable

## Status

Active.

## Related Docs

- [Navigation](../ux/navigation.md)
- [Dashboard](../ux/dashboard.md)
- [Project Structure](./project-structure.md)
- [Backend Architecture](./backend-architecture.md)
- [Tech Stack](./tech-stack.md)
- [Theme System](../brand/theme-system.md)
- [Style Doctrine](../brand/style-doctrine.md)
