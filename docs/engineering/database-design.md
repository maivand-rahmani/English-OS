# Database Design

## Purpose

This document defines the persistence design of English OS.

The database should support a serious product foundation while respecting the V1 decision to keep high-frequency learner state local-first where possible.

## Database Stack

V1 should use:

- PostgreSQL
- Supabase Postgres as the managed provider
- Prisma ORM
- Prisma migrations

## Database Role In V1

The database should own:

- authentication tables used by Auth.js Prisma Adapter
- user account records
- product-controlled curated content when it becomes database-backed
- server-persisted learner profile data
- AI feedback records when saved server-side
- synced learning events when sync is enabled

The browser may own first:

- local progress state
- local learning events
- review interaction state
- writing drafts
- lightweight practice history

This split reduces backend load while keeping the server database ready for account-level persistence later.

## Auth Tables

Auth.js with Prisma Adapter usually requires models such as:

- `User`
- `Account`
- `Session`
- `VerificationToken`

These should be represented in Prisma and kept compatible with Auth.js expectations.

## Product Tables

The product database should eventually include tables for:

- learners or learner profiles
- skills
- subskills
- roadmap templates
- roadmap stages
- roadmap blocks
- resources
- resource collections
- writing tasks
- speaking prompts

These are product-controlled or account-level structures.

## Learner State Tables

When server persistence is enabled, the database should support:

- learner roadmap state
- learner block state
- review items
- skill progress snapshots
- learner insights
- writing attempts
- speaking sessions
- synced learning events

These should mirror the system model without forcing every V1 click to hit the database.

## Local-First Event Sync

The `learning_events` table should be designed for future sync from browser-local events.

It should support:

- server id
- client event id
- user id
- event type
- event timestamp
- received timestamp
- payload
- schema version

The combination of user id and client event id should be unique to make sync idempotent.

## Suggested Table Groups

### Auth

- `users`
- `accounts`
- `sessions`
- `verification_tokens`

### Learner

- `learner_profiles`
- `learner_preferences`

### Learning Structure

- `skills`
- `subskills`
- `roadmap_templates`
- `roadmap_stages`
- `roadmap_blocks`
- `block_skill_maps`

### Resources

- `resources`
- `resource_skill_maps`
- `resource_collections`
- `resource_collection_items`

### Learner State

- `learner_roadmaps`
- `learner_stage_states`
- `learner_block_states`
- `review_items`
- `skill_progress_states`
- `learner_insights`

### Practice

- `writing_tasks`
- `writing_attempts`
- `writing_feedback`
- `writing_mistake_patterns`
- `speaking_prompts`
- `speaking_sessions`
- `speaking_transcripts`
- `speaking_feedback`
- `speaking_patterns`

### Events

- `learning_events`

## Indexing Principles

Indexes should support:

- auth lookups
- user-owned state reads
- current roadmap state
- due review items
- learning event sync idempotency
- event queries by user and timestamp
- resource lookup by level, skill, and format

Avoid premature indexing on fields that are not queried yet.

## Prisma Modeling Principles

Prisma models should:

- use clear relation names
- use explicit enum fields for stable state values
- use JSON fields for flexible event payloads when appropriate
- avoid encoding important queryable state only inside JSON
- keep timestamps consistent

## Connection Strategy

Because the app uses Vercel and Supabase Postgres, connection handling matters.

Implementation should keep separate environment variables for:

- runtime pooled connection
- direct migration connection

Prisma migrations should use the connection mode recommended for schema changes, while runtime queries should use the connection strategy appropriate for serverless execution.

## Migration Strategy

Use Prisma migrations as the source of database schema changes.

Do not manually edit production schema outside migrations unless there is a documented emergency reason.

## Status

Active.

## Related Docs

- [Data Model](../system/data-model.md)
- [Analytics](../system/analytics.md)
- [Tech Stack](./tech-stack.md)
- [Backend Architecture](./backend-architecture.md)
