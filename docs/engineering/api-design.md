# API Design

## Purpose

This document defines API design principles for English OS.

The API should support the product without turning every small learner action into a backend round trip.

## API Philosophy

V1 should use the smallest API surface that keeps the product clean.

Use:

- server actions for app-local mutations where they make sense
- route handlers for clear HTTP boundaries
- local browser persistence for high-frequency learner actions
- future batch sync for local learning events

## What Should Use API Routes

API route handlers are appropriate for:

- Auth.js routes
- AI endpoints
- sync endpoints
- webhooks if added later
- integration boundaries

They are not required for every internal product operation.

## What Should Stay Local In V1

These actions can be local-first:

- marking a resource complete
- updating local roadmap block state
- adding a local learning event
- updating review item local state
- saving a writing draft
- storing lightweight practice history

The UI should update from local state immediately.

## Future Sync API

When server sync is added, prefer batched endpoints.

Example:

```text
POST /api/sync/learning-events
```

Payload shape should include:

- client event id
- event type
- event timestamp
- payload
- local schema version

The endpoint should be idempotent so retrying the same sync does not duplicate learning history.

## AI API Boundaries

AI calls should go through server-side endpoints or server actions.

Possible endpoints:

```text
POST /api/ai/writing-feedback
POST /api/ai/speaking-feedback
POST /api/ai/recommendation-explanation
```

These endpoints should:

- require authentication when needed
- validate payloads
- avoid exposing provider API keys
- return structured responses

## Auth Expectations

Use NextAuth/Auth.js for authentication.

Authenticated server handlers should:

- read the session server-side
- verify access before reading or writing user-owned data
- never trust `userId` from client payload alone

## Request Validation

All server-facing payloads should be validated.

Use schema validation for:

- AI requests
- sync payloads
- profile updates
- settings updates
- future persisted progress updates

The exact validation library can be decided during implementation, but unvalidated payloads should not reach domain services.

## Response Shape

Prefer predictable response shapes.

Example:

```ts
type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };
```

Do not leak provider errors, Prisma errors, or stack traces to the client.

## API Versioning

V1 does not need public API versioning.

If sync payloads become important, use an internal `schemaVersion` field in event payloads and sync requests.

## Status

Active.

## Related Docs

- [Backend Architecture](./backend-architecture.md)
- [Frontend Architecture](./frontend-architecture.md)
- [Data Model](../system/data-model.md)
- [Project Structure](./project-structure.md)
