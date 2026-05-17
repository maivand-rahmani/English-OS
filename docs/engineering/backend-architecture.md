# Backend Architecture

## Purpose

This document defines the backend architecture of English OS.

For V1, the backend should live inside the Next.js application while keeping clear service boundaries so a dedicated backend can be introduced later if needed.

## Backend Goals

The backend should:

- manage authentication through Auth.js
- provide server-only domain services
- protect AI calls and API keys
- support Prisma/PostgreSQL persistence
- avoid being called for every small learner interaction
- allow future sync of client-first learner state

## Backend Shape In V1

V1 should not start with a separate backend server.

Use Next.js for:

- server actions
- route handlers
- server-only services
- Auth.js routes
- AI request handling

The important architecture decision is not where the code runs, but whether the code is organized into clean domain services.

## Server Domain Services

Backend services should live under:

```text
src/server/
```

Recommended domains:

- `auth`
- `db`
- `ai`
- `sync`
- `learners`
- `roadmap`
- `resources`
- `progress`
- `review`
- `recommendations`
- `writing`
- `speaking`
- `events`

## Product Logic Placement

Product logic should live in server services or shared domain modules, not in route handlers.

Examples:

- recommendation candidate generation belongs in `src/server/recommendations`
- review generation belongs in `src/server/review`
- event recording belongs in `src/server/events`
- AI prompt construction belongs in `src/server/ai`

Route handlers and server actions should call these services rather than implement logic inline.

## Client-First Backend Policy

The backend should not be the first destination for every progress click in V1.

The browser can own high-frequency state first:

- local progress
- local learning events
- local review state
- drafts
- small practice history

The backend should be used for:

- auth
- AI calls
- loading database-backed curated content when needed
- saving account-level state when sync is enabled
- accepting batched event sync later

This keeps V1 fast and reduces server load.

## Sync Boundary

Even if full sync is not implemented immediately, the backend should have a conceptual sync boundary.

Future sync should support:

- receiving local learning events in batches
- validating event payloads
- storing events idempotently
- updating derived server-side progress snapshots
- returning server-confirmed state if needed

Recommended location:

```text
src/server/sync/
```

## Database Access

Prisma access should be centralized through:

```text
src/server/db/
```

Avoid importing Prisma directly throughout the app.

Domain services should use database helpers or repositories so future persistence changes are easier.

## AI Boundary

All OpenAI calls should be server-side only.

AI service code should live under:

```text
src/server/ai/
```

AI should support:

- writing feedback
- speaking feedback
- recommendation explanations
- learner insights

AI should not own:

- core roadmap state
- review triggers
- event capture
- authentication
- database schema

## Background Work

V1 should avoid adding a separate worker system until needed.

If background behavior is needed early, prefer:

- explicit server actions
- route handlers called by user actions
- lightweight scheduled work only if hosting supports it simply

Do not introduce queue infrastructure before the product proves it needs it.

## Error Handling

Backend services should return predictable result shapes.

Avoid throwing raw database or provider errors into UI code.

Errors should be mapped into:

- validation error
- auth error
- not found
- provider failure
- unexpected server error

## Status

Active.

## Related Docs

- [System Architecture](../system/architecture.md)
- [API Design](./api-design.md)
- [Database Design](./database-design.md)
- [AI Role In V1](../ai/ai-role-in-v1.md)
