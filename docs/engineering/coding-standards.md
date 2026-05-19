# Coding Standards

## Purpose

This document defines coding standards for the English OS codebase.

The goal is to keep the product easy to extend as roadmap, resources, progress, review, writing, speaking, and AI features grow.

## General Principles

1. Keep product logic out of route files.
2. Keep server-only code out of client components.
3. Keep domain code out of generic shared folders.
4. Prefer explicit domain names over vague utility names.
5. Store high-frequency learner state locally first when possible.
6. Keep server sync and database persistence boundaries ready for later.

## TypeScript Rules

- Use TypeScript strictly.
- Prefer explicit domain types for roadmap, resource, review, writing, speaking, and learning events.
- Avoid `any` unless there is a narrow documented reason.
- Prefer discriminated unions for event types and state machines.
- Keep external provider response types isolated behind adapters.

## File Naming

Use lowercase hyphenated folder names:

- `complete-resource`
- `dashboard-today-plan`
- `record-learning-event`

Use specific file names:

- `get-dashboard-state.ts`
- `resource-card.tsx`
- `complete-review-item-action.ts`
- `local-learning-event-store.ts`

Avoid vague names:

- `utils.ts`
- `helpers.ts`
- `data.ts`
- `service.ts`

## FSD Rules

- `app` composes routes and layouts.
- `widgets` compose large UI sections.
- `features` implement user workflows.
- `entities` represent domain objects.
- `shared` contains genuinely reusable infrastructure and primitives.
- `server` contains server-only domain services.

Import direction should follow [Project Structure](./project-structure.md).

## Server Rules

- Prisma access should go through `src/server/db`.
- Auth logic should live in `src/server/auth`.
- AI calls should live in `src/server/ai`.
- Recommendation logic should live in `src/server/recommendations`.
- Review logic should live in `src/server/review`.
- Event recording and sync should live in `src/server/events` and `src/server/sync`.

Do not put database-heavy business logic inside UI components or route files.

## Client Persistence Rules

For V1, do not call the backend for every small learner action.

Prefer:

- local write
- local event queue append
- immediate UI update
- optional sync later

Use localStorage only for small non-sensitive preferences.

Use IndexedDB or an equivalent browser database layer for structured local learner state.

Do not store secrets, provider keys, or sensitive server-only data in browser storage.

## API Rules

- Validate all server-facing payloads.
- Return predictable result shapes.
- Do not expose provider errors directly.
- Make future sync endpoints idempotent.
- Do not trust client-provided user ids when a server session is available.

## UI Rules

- Use shadcn/ui primitives where they help.
- Build English OS-specific composed components instead of leaking raw primitives everywhere.
- Keep dashboard widgets purposeful and action-oriented.
- Avoid making whole pages client components unless necessary.
- Keep forms and interactive flows accessible.
- Use semantic design tokens and CSS variables for product styling.
- Do not hardcode theme colors, font families, motion durations, or major radius values inside components.
- Make appearance preferences compatible with theme, font, text scale, density, and motion settings.

## Visual Implementation Rules

- Treat the supplied dashboard reference as the canonical V1 desktop frame.
- Do not implement a generic dashboard and call it Soft Liquid OS.
- Do not let default shadcn component styling define the product look.
- Match the reference's shell silhouette, pill navigation, left rail rhythm, panel softness, and black active states.
- Keep screens minimal and edited; do not add widgets just because data exists.
- Prefer one strong primary panel and a small number of supporting panels.
- Keep visual decisions tokenized even when matching the reference closely.
- If a screen looks unrelated to the reference at first glance, revise the layout before adding features.

## AI Rules

- Never call OpenAI directly from client components.
- Keep prompts and provider code in `src/server/ai`.
- Store AI outputs in structured shapes where possible.
- Do not let AI own core roadmap, review, or progress state.

## Documentation Rules

When a decision affects product architecture, update docs.

Use:

- `docs/product` for product scope
- `docs/ux` for user-facing behavior
- `docs/system` for domain logic
- `docs/engineering` for implementation decisions
- `docs/decisions` for major irreversible or controversial decisions

## Status

Active.

## Related Docs

- [Project Structure](./project-structure.md)
- [Frontend Architecture](./frontend-architecture.md)
- [Backend Architecture](./backend-architecture.md)
- [API Design](./api-design.md)
- [Decision Log](../decisions/decision-log.md)
