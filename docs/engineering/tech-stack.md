# Tech Stack

## Purpose

This document defines the technical stack for English OS V1 and explains why each choice was made.

The stack should support a polished MVP, fast iteration, clean product logic, and future expansion into deeper AI and analytics.

## Final V1 Stack

English OS V1 should use:

- Next.js App Router
- TypeScript
- PostgreSQL
- Supabase Postgres as the managed database provider
- Prisma ORM
- NextAuth/Auth.js
- Vercel for deployment
- Tailwind CSS
- shadcn/ui primitives
- OpenAI API as a server-side AI layer
- internal `learning_events` table for product intelligence
- browser storage for client-first V1 learner state

## Stack Philosophy

The stack should make the product:

- fast to build
- easy to deploy
- pleasant to maintain
- portable away from managed services later
- structured enough for real domain logic

English OS should not be locked into a no-code backend or a prompt-only architecture. The product's core learning system should live in the application and database.

## Frontend

### Choice

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui primitives

### Why

Next.js gives the product a strong full-stack application foundation while keeping deployment simple on Vercel.

TypeScript is necessary because English OS will have many domain entities and state transitions. The app should not rely on loosely shaped objects for roadmap, progress, review, or recommendation logic.

Tailwind CSS and shadcn/ui primitives give us speed and accessibility without forcing a generic visual identity. The final product should still have its own English OS style.

## Backend

### Choice

Use Next.js server-side capabilities for V1:

- server actions where appropriate
- route handlers where an HTTP boundary is useful
- server-only domain services for product logic

### Why

V1 does not need a separate backend server.

Keeping backend logic inside the Next.js app reduces operational complexity while still allowing clean domain boundaries. If English OS later needs a dedicated API or worker service, the domain logic should already be separated enough to move without rewriting the product.

## Database

### Choice

- PostgreSQL
- Supabase Postgres as the hosted provider for V1

### Why

English OS has a relational domain:

- learners
- profiles
- roadmap templates
- roadmap blocks
- resources
- progress states
- review items
- writing attempts
- speaking sessions
- learning events

PostgreSQL fits this shape better than a document-first database.

Supabase gives us a fast managed Postgres start while preserving the option to move to another Postgres provider or a self-managed server later.

## ORM

### Choice

- Prisma ORM

### Why

Prisma gives:

- readable schema modeling
- migrations
- typed client access
- strong developer experience
- Prisma Studio for inspecting data during development

This is a good fit for English OS because the data model will be broad and important. Prisma also supports a future move away from Supabase as long as the target remains PostgreSQL-compatible.

## Authentication

### Choice

- NextAuth/Auth.js
- Prisma Adapter

### Why

NextAuth/Auth.js keeps authentication inside the application architecture instead of tying it to Supabase Auth.

This supports the product's portability goal:

- Supabase can be used as a Postgres provider now
- Auth data can live in the same Prisma-managed database model
- future migration to another Postgres host or custom server becomes easier

## Hosting

### Choice

- Vercel free tier for V1

### Why

Vercel is the simplest deployment target for a Next.js V1. It supports fast iteration, preview deployments, and a low-friction path to a hosted MVP.

V1 should optimize for shipping a polished product quickly before adding infrastructure complexity.

## AI

### Choice

- OpenAI API
- server-side only
- isolated behind an internal AI service layer

### Why

AI should support English OS but not become the core product architecture.

OpenAI calls should never be made directly from client UI code. Writing feedback, speaking feedback, recommendation explanation, and future AI insights should go through server-side functions or services.

## Analytics And Learning Intelligence

### Choice

Use an internal learning-event model from day one.

For V1, high-frequency learner events may be stored locally in the browser first, then synced to the server later or in batches when server persistence is enabled.

### Why

English OS needs first-party learning history as a product primitive, not only third-party analytics.

The learning-event model should capture product-significant events such as:

- resource started
- resource completed
- roadmap block started
- roadmap block completed
- review item completed
- writing submitted
- speaking recorded

This event stream should become the foundation for progress, review, recommendations, and future AI personalization.

Product analytics tools such as PostHog can be added later, but they should not replace the internal learning event model.

## Browser Persistence

### Choice

Use browser storage for high-frequency V1 learner state.

Recommended split:

- IndexedDB for structured learner progress, local learning events, queues, drafts, and larger state.
- localStorage only for small non-sensitive UI preferences.
- React state for temporary screen-only state.

### Why

The product should not send a backend request for every small learner action.

Client-first persistence gives V1:

- faster interactions
- lower backend load
- simpler early iteration
- a smoother path for offline-friendly behavior later

This must be implemented behind clear persistence boundaries so the same product flows can later sync to PostgreSQL.

## Connection Pooling Note

Because V1 uses Vercel, Prisma, and Supabase Postgres, database connection strategy matters.

The engineering setup should distinguish:

- runtime application connection string
- migration connection string

Supabase provides connection pooling options, and Prisma has specific expectations around runtime and migration connections. This should be handled carefully during implementation.

## Portability Goal

The stack should keep English OS portable.

This means:

- avoid Supabase-specific product logic where plain Postgres is enough
- keep Auth.js and Prisma models application-owned
- keep AI calls behind a service boundary
- keep domain logic separate from route handlers and UI components
- keep client persistence behind replaceable repository interfaces

## Deferred Choices

These are not required for the first engineering decision:

- separate backend service
- background worker platform
- PostHog or another analytics vendor
- dedicated object storage strategy
- mobile app stack

They can be added later if the product needs them.

## Status

Active.

## Related Docs

- [System Architecture](../system/architecture.md)
- [Data Model](../system/data-model.md)
- [Frontend Architecture](./frontend-architecture.md)
- [Backend Architecture](./backend-architecture.md)
- [Database Design](./database-design.md)
