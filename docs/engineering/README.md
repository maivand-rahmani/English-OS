# Engineering Docs

This section defines how English OS should be built from a technical point of view.

Use this section for stack choice, project structure, implementation standards, architecture boundaries, persistence strategy, and API planning.

## Documents In This Section

- [Tech Stack](./tech-stack.md)
- [Project Structure](./project-structure.md)
- [Frontend Architecture](./frontend-architecture.md)
- [Backend Architecture](./backend-architecture.md)
- [API Design](./api-design.md)
- [Database Design](./database-design.md)
- [Coding Standards](./coding-standards.md)

## Reading Order

1. [Tech Stack](./tech-stack.md)
2. [Project Structure](./project-structure.md)
3. [Frontend Architecture](./frontend-architecture.md)
4. [Backend Architecture](./backend-architecture.md)
5. [API Design](./api-design.md)
6. [Database Design](./database-design.md)
7. [Coding Standards](./coding-standards.md)

## Core Engineering Decisions

- Use Next.js App Router, TypeScript, Prisma, PostgreSQL, Supabase Postgres, NextAuth/Auth.js, Vercel, Tailwind CSS, and shadcn/ui primitives.
- Use a Feature-Sliced Design inspired structure adapted for Next.js.
- Keep route files thin and move product logic into domain services and feature boundaries.
- Use client-first persistence for high-frequency learner state in V1 to reduce backend requests.
- Keep server persistence and sync boundaries ready so local learner state can later move into PostgreSQL cleanly.
- Keep AI calls server-side and behind a dedicated service layer.

## Client-First Persistence Rule

For V1, learner progress and high-frequency interaction state should be stored locally in the browser first when possible.

This includes state like:

- completed resources
- local learning events
- roadmap block interaction state
- review item local state
- writing drafts
- speaking session metadata where appropriate

The implementation should still be designed with server sync in mind. Local persistence should use clear repository interfaces so the app can later swap or augment local storage with PostgreSQL-backed persistence.

## Related Docs

- [Docs Home](../README.md)
- [System README](../system/README.md)
- [Roadmap README](../roadmap/README.md)
