# Project Structure

## Purpose

This document defines how the English OS codebase should be organized.

The project should use a Feature-Sliced Design inspired structure adapted for Next.js App Router.

## Structure Philosophy

English OS has clear product domains:

- learner
- roadmap
- resources
- progress
- review
- writing
- speaking
- recommendations
- AI

The file structure should make these domains visible.

The goal is to avoid placing all logic inside route files, UI components, or a generic `lib` folder.

## FSD Adaptation For Next.js

Feature-Sliced Design usually separates code into layers like app, pages, widgets, features, entities, and shared.

For English OS, Next.js App Router already owns the route-level `src/app` directory.

So the adapted structure should be:

- `src/app`
  Next.js routing, layouts, route handlers, and app-level providers.
- `src/widgets`
  Large page sections and composed UI blocks.
- `src/features`
  User-facing actions and workflows.
- `src/entities`
  Domain entities and domain-specific UI/model code.
- `src/shared`
  Reusable infrastructure, UI primitives, utilities, and config.
- `src/server`
  Server-only domain services, auth, database access, AI services, and business logic.

This keeps Next.js routing clean while still preserving the spirit of FSD.

## Recommended Repository Layout

```text
.
├── docs/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
├── src/
│   ├── app/
│   ├── widgets/
│   ├── features/
│   ├── entities/
│   ├── shared/
│   └── server/
├── .env.example
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## `src/app`

This directory should contain Next.js App Router files.

Its responsibilities:

- route segments
- layouts
- loading and error states
- route handlers
- metadata
- app-level provider wiring

It should not contain heavy product logic.

Example:

```text
src/app/
├── (auth)/
│   ├── sign-in/
│   │   └── page.tsx
│   └── sign-up/
│       └── page.tsx
├── (onboarding)/
│   └── onboarding/
│       └── page.tsx
├── (app)/
│   ├── layout.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── roadmap/
│   │   └── page.tsx
│   ├── resources/
│   │   └── page.tsx
│   ├── writing/
│   │   └── page.tsx
│   ├── speaking/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts
│   └── ai/
│       └── route.ts
├── layout.tsx
└── page.tsx
```

Route files should compose widgets and call server-side loading functions. They should not become the main place where roadmap, review, or recommendation logic is written.

For the current V1 architecture, `/practice` is the active top-level output
route. `/writing` and `/speaking` may remain in `src/app` only as thin legacy
redirects while the older top-level split is being retired.

## `src/widgets`

Widgets are large composed interface blocks.

They are bigger than UI primitives and usually belong to a product surface.

Current V1 practice work should center on a `practice-overview` style widget,
with writing and speaking widgets treated as mode-level internals rather than
separate top-level product pages.

Example:

```text
src/widgets/
├── app-shell/
├── dashboard-today-plan/
├── dashboard-progress-snapshot/
├── roadmap-explorer/
├── resource-recommendation-panel/
├── writing-workspace/
└── speaking-workspace/
```

Widgets can compose features, entities, and shared UI.

## `src/features`

Features represent user actions and workflows.

Examples:

```text
src/features/
├── onboarding/
├── complete-resource/
├── update-roadmap-block-state/
├── submit-writing/
├── record-speaking-session/
├── complete-review-item/
├── generate-daily-plan/
└── request-ai-feedback/
```

Feature folders may contain:

```text
feature-name/
├── ui/
├── model/
├── actions/
└── index.ts
```

Feature code should coordinate a user action but should not own the whole domain model.

## `src/entities`

Entities represent domain objects and their local presentation or client-side model helpers.

Examples:

```text
src/entities/
├── learner/
├── roadmap/
├── resource/
├── review/
├── progress/
├── writing/
├── speaking/
└── recommendation/
```

Entity folders may contain:

```text
entity-name/
├── ui/
├── model/
├── lib/
└── index.ts
```

Entities should be domain-aware but not tied to specific page routes.

## `src/shared`

Shared contains reusable code that is not specific to one product domain.

Example:

```text
src/shared/
├── ui/
├── lib/
├── persistence/
├── config/
├── constants/
├── types/
└── styles/
```

Typical contents:

- shadcn/ui primitives
- base design tokens
- common utilities
- date helpers
- environment helpers
- browser persistence adapters
- shared types

Shared should stay genuinely shared. Domain code should not be hidden here.

## `src/server`

Server contains server-only application logic.

This is where English OS should keep backend domain services while still using Next.js as the V1 backend.

Example:

```text
src/server/
├── auth/
├── db/
├── ai/
├── sync/
├── learners/
├── roadmap/
├── resources/
├── progress/
├── review/
├── recommendations/
├── writing/
├── speaking/
└── events/
```

Important rule:

Server-only logic should not be imported into client components.

## `src/server/db`

Database access should be centralized.

Example:

```text
src/server/db/
├── prisma.ts
├── queries/
└── transactions/
```

Prisma client setup should live here.

Raw database calls should not be scattered throughout route files and components.

## `src/server/events`

The internal learning event system should live here.

Example:

```text
src/server/events/
├── record-learning-event.ts
├── event-types.ts
└── event-payloads.ts
```

This area should support the `learning_events` table and become the foundation for product intelligence.

## `src/server/ai`

AI calls should be isolated here.

Example:

```text
src/server/ai/
├── openai-client.ts
├── writing-feedback.ts
├── speaking-feedback.ts
└── recommendation-explanations.ts
```

UI and feature code should call application services, not OpenAI directly.

## `src/shared/persistence`

Client-first persistence should live behind small typed adapters.

Example:

```text
src/shared/persistence/
├── browser-db.ts
├── local-event-queue.ts
├── storage-keys.ts
└── persistence-types.ts
```

This area should contain infrastructure for browser storage, not product-specific business rules.

Domain-specific local repositories can live closer to their domain or feature, but they should use these shared persistence primitives.

## `src/server/sync`

Future server sync logic should live here.

Example:

```text
src/server/sync/
├── sync-learning-events.ts
├── sync-progress-state.ts
└── sync-conflict-policy.ts
```

This folder may start small or empty in the earliest V1 work, but the boundary should exist conceptually from the beginning.

## Prisma

Prisma should live in the root `prisma/` directory:

```text
prisma/
├── schema.prisma
└── migrations/
```

The Prisma schema should reflect the system data model documented in [Data Model](../system/data-model.md).

## Import Direction Rules

The codebase should follow simple import direction rules:

- `app` can import from `widgets`, `features`, `entities`, `shared`, and server loaders/actions.
- `widgets` can import from `features`, `entities`, and `shared`.
- `features` can import from `entities`, `shared`, and server actions/services.
- `entities` can import from `shared`.
- `shared` should not import from product-specific layers.
- client components must not import server-only modules.
- browser persistence adapters should not import Prisma or server-only code.
- server sync code can import database services, but not client UI code.

These rules should keep the structure understandable as the product grows.

## Naming Conventions

Use clear lowercase folder names with hyphens:

- `dashboard-today-plan`
- `complete-review-item`
- `record-speaking-session`

Use descriptive file names:

- `get-dashboard-state.ts`
- `record-learning-event.ts`
- `complete-resource-action.ts`
- `roadmap-step-node.tsx`
- `roadmap-step-modal.tsx`

Avoid vague names like:

- `utils.ts`
- `helpers.ts`
- `data.ts`
- `service.ts`

If a generic file name becomes tempting, the module probably needs a more precise boundary.

## Route-Level Rule

Route files should stay thin.

They should usually:

- load required server data
- compose widgets
- provide page metadata
- handle route-level loading or error UI

They should not own:

- recommendation logic
- progress inference
- review generation
- AI prompt construction
- Prisma-heavy business logic

## V1 Structure Priority

For V1, prioritize:

- clean app shell
- clear feature boundaries
- server-side domain services
- first-party learning events
- portable database structure

Do not over-split tiny code too early. The structure should guide the product, not slow every simple change.

## Status

Active.

## Related Docs

- [Tech Stack](./tech-stack.md)
- [Frontend Architecture](./frontend-architecture.md)
- [Backend Architecture](./backend-architecture.md)
- [Database Design](./database-design.md)
- [Coding Standards](./coding-standards.md)
