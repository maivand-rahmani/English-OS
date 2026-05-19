# Start Here

## Purpose

This is the first file an AI agent or developer should read before working on English OS.

It explains where the documentation lives, how to use it, how to understand the current project state, and how to continue from the latest completed work.

## First Rule

Do not start implementation by guessing.

Read the relevant docs first, then continue from the current roadmap state.

## Documentation Map

The documentation hub is:

- [Docs Home](./README.md)

Main sections:

- [Product](./product/README.md)
- [UX](./ux/README.md)
- [System](./system/README.md)
- [Engineering](./engineering/README.md)
- [AI](./ai/README.md)
- [Brand](./brand/README.md)
- [Decisions](./decisions/README.md)
- [Roadmap](./roadmap/README.md)

## Required Reading Before Work

For any task, read:

1. [Decision Log](./decisions/decision-log.md)
2. [V1 MVP Roadmap](./roadmap/v1-mvp-roadmap.md)
3. the section README that matches the task

For product work, read:

1. [Product Thesis](./product/thesis.md)
2. [MVP Definition](./product/mvp.md)
3. [Feature Scope](./product/feature-scope.md)

For UI work, read:

1. [Information Architecture](./ux/information-architecture.md)
2. [Navigation](./ux/navigation.md)
3. [Style Doctrine](./brand/style-doctrine.md)
4. [Visual Direction](./brand/visual-direction.md)
5. [Reference Notes](./brand/reference-notes.md)
6. [Style Acceptance Checklist](./brand/style-acceptance-checklist.md)
7. [Motion Direction](./brand/motion-direction.md)
8. [Theme System](./brand/theme-system.md)

For engineering work, read:

1. [Tech Stack](./engineering/tech-stack.md)
2. [Project Structure](./engineering/project-structure.md)
3. [Frontend Architecture](./engineering/frontend-architecture.md)
4. [Backend Architecture](./engineering/backend-architecture.md)
5. [Coding Standards](./engineering/coding-standards.md)

## How To Continue Work

Before starting:

1. Open [V1 MVP Roadmap](./roadmap/v1-mvp-roadmap.md).
2. Find the first unchecked phase or task.
3. Read the related docs for that phase.
4. Continue from there.
5. After completing work, update the roadmap checkboxes.

If a task changes architecture, update:

- [Decision Log](./decisions/decision-log.md)

If a task changes style direction, update:

- [Style Doctrine](./brand/style-doctrine.md)
- [Visual Direction](./brand/visual-direction.md)
- [Motion Direction](./brand/motion-direction.md)
- [Theme System](./brand/theme-system.md)

If a task changes product scope, update:

- [MVP Definition](./product/mvp.md)
- [Feature Scope](./product/feature-scope.md)

## Current Project Doctrine

English OS is:

- a personal operating system for learning English
- system-first, not lesson-first
- guidance-first, not content-heavy
- resource-curation-first, not a giant internal course library
- AI-assisted, not AI-owned

The canonical UI style is:

- [Soft Liquid OS](./brand/style-doctrine.md)

The V1 stack is:

- Next.js App Router
- TypeScript
- PostgreSQL
- Supabase Postgres
- Prisma
- NextAuth/Auth.js
- Vercel
- Tailwind CSS
- shadcn/ui primitives
- OpenAI API server-side

The V1 persistence direction is:

- client-first for high-frequency learner state
- server-ready boundaries for future sync

## Roadmap Update Rule

When work is completed, update [V1 MVP Roadmap](./roadmap/v1-mvp-roadmap.md):

- mark completed tasks with `[x]`
- keep incomplete tasks as `[ ]`
- add short notes only when they clarify what happened
- do not mark a phase complete unless its completion criteria are true

## Working Style

Keep the product aligned with:

- clarity instead of chaos
- roadmap instead of random studying
- trusted resources instead of endless searching
- progress system instead of scattered notes
- personalization instead of generic advice
- motion-led premium interface instead of static dashboard templates

## Status

Active.

## Related Docs

- [Docs Home](./README.md)
- [V1 MVP Roadmap](./roadmap/v1-mvp-roadmap.md)
- [Decision Log](./decisions/decision-log.md)
