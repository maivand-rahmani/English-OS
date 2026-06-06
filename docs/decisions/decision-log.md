# Decision Log

## Purpose

This document lists major accepted decisions for English OS in short form.

Use this file when a future agent or developer needs to understand what has already been decided without reading every planning conversation.

## Decisions

### 2026-05-17: English OS Is System-First, Not Lesson-First

Status: accepted.

English OS is a personal operating system for learning English, not a course platform, lesson factory, or Duolingo-style app.

Related docs:

- [Product Thesis](../product/thesis.md)
- [MVP Definition](../product/mvp.md)

### 2026-05-17: V1 Top-Level Product Sections

Status: accepted.

V1 should use these top-level sections:

- Dashboard
- Roadmap
- Resources
- Writing
- Speaking
- Settings

Related docs:

- [Information Architecture](../ux/information-architecture.md)
- [Navigation](../ux/navigation.md)

### 2026-05-17: V1 Engineering Stack

Status: accepted.

V1 should use Next.js App Router, TypeScript, PostgreSQL, Supabase Postgres, Prisma, NextAuth/Auth.js, Vercel, Tailwind CSS, shadcn/ui primitives, and server-side OpenAI API integration.

Related docs:

- [Tech Stack](../engineering/tech-stack.md)

### 2026-05-17: Feature-Sliced Design Adapted For Next.js

Status: accepted.

The codebase should use a Feature-Sliced Design inspired structure adapted for Next.js App Router. `src/app` owns routing, while `src/widgets`, `src/features`, `src/entities`, `src/shared`, and `src/server` hold the product structure.

Related docs:

- [Project Structure](../engineering/project-structure.md)

### 2026-05-17: Client-First Persistence For High-Frequency V1 Learner State

Status: accepted.

V1 should avoid making backend requests for every small learner action. High-frequency learner state should be stored locally in the browser first when possible.

This includes:

- local progress state
- local learning events
- roadmap block interaction state
- review interaction state
- writing drafts
- lightweight practice history

The implementation should still keep server sync boundaries ready so this local state can later be synced to PostgreSQL.

Related docs:

- [Frontend Architecture](../engineering/frontend-architecture.md)
- [Backend Architecture](../engineering/backend-architecture.md)
- [API Design](../engineering/api-design.md)
- [Database Design](../engineering/database-design.md)

### 2026-05-17: AI Is A Lightweight V1 Assistant Layer

Status: accepted.

AI in V1 should support writing feedback, speaking feedback, recommendation explanations, and learner insights. AI should not own core roadmap structure, progress logic, review triggers, or database truth.

Related docs:

- [AI Role In V1](../ai/ai-role-in-v1.md)
- [AI Recommendations](../ai/ai-recommendations.md)

### 2026-05-17: English OS Should Be Motion-Led

Status: accepted.

Animation should be an important part of the English OS product identity. Motion should communicate state, progress, transitions, feedback, and system responsiveness while staying calm and serious.

Related docs:

- [Design Principles](../brand/design-principles.md)
- [Motion Direction](../brand/motion-direction.md)
- [Visual Direction](../brand/visual-direction.md)
- [Release Criteria](../roadmap/release-criteria.md)

### 2026-05-17: First Visual References Define Structure Direction

Status: accepted.

The first supplied visual references should guide product structure and first-glance feel. English OS should borrow the large rounded app canvas, shell framing discipline, centered pill navigation, soft panel surfaces, black active states, right-side context panels, and tactile animated behavior.

The references should not be copied literally, and English OS should not drift into course-platform or live-class product behavior.

Related docs:

- [Reference Notes](../brand/reference-notes.md)
- [Visual Direction](../brand/visual-direction.md)
- [Motion Direction](../brand/motion-direction.md)

### 2026-05-17: Style System Must Be Token-Based And Themeable

Status: accepted.

English OS styling should be built through design tokens and CSS variables. The product should support light/dark modes, future theme templates, configurable fonts, text size, interface density, and motion intensity.

User appearance preferences should be stored locally first and later may sync to the user's account.

Related docs:

- [Theme System](../brand/theme-system.md)
- [Frontend Architecture](../engineering/frontend-architecture.md)
- [Settings UX](../ux/settings.md)

### 2026-05-17: Soft Liquid OS Is The Canonical UI/UX Style Direction

Status: accepted.

English OS should use a Soft Liquid OS interface: a motion-led, token-based, glass-tactile productivity dashboard style with calm premium surfaces, strong black active states, customizable themes, and rich but purposeful animation.

Related docs:

- [Style Doctrine](../brand/style-doctrine.md)
- [Visual Direction](../brand/visual-direction.md)
- [Motion Direction](../brand/motion-direction.md)
- [Theme System](../brand/theme-system.md)

### 2026-05-19: Dashboard Reference Is The Canonical V1 Desktop Frame

Status: accepted.

The supplied dashboard reference should be treated as the canonical V1 desktop frame for English OS.

The implementation should closely match its structure, spacing logic, app shell silhouette, calm brand framing, centered pill navigation, right utility cluster, soft rounded panels, black active states, and calm two-column dashboard composition.

The product may change colors, content, typography details, and English OS-specific modules, but it should not drift into a generic admin dashboard, default shadcn layout, or overloaded analytics wall.

Minimalism is also accepted as a core visual discipline: the interface should feel edited, calm, and purposeful, with one dominant focus and a small number of supporting modules.

Related docs:

- [Reference Notes](../brand/reference-notes.md)
- [Style Doctrine](../brand/style-doctrine.md)
- [Visual Direction](../brand/visual-direction.md)
- [Dashboard UX](../ux/dashboard.md)
- [Release Criteria](../roadmap/release-criteria.md)

### 2026-06-06: Dashboard Reference Is Scoped To Shell And Dashboard

Status: accepted.

The supplied dashboard reference remains canonical for the shared shell and the
Dashboard page.

It does not mean every learner-facing page should copy Dashboard composition.

Resources, Roadmap, Writing, Speaking, review flows, and other learner-facing
surfaces should inherit the shell, material language, navigation grammar, and
interaction quality without defaulting to wide-left plus narrow-right dashboard
layouts.

Related docs:

- [Layout Principles](../ux/layout-principles.md)
- [Frontend Architecture](../engineering/frontend-architecture.md)
- [Style Doctrine](../brand/style-doctrine.md)
- [Visual Direction](../brand/visual-direction.md)

### 2026-06-06: Forbidden Pattern - Stacked Dashboard Block Layout

Status: accepted.

English OS pages must not default to a stacked dashboard-block layout unless
the page is explicitly an analytics dashboard or an admin-style monitoring
surface.

Forbidden default pattern:

- header block
- recommendation block
- search and filters block
- results block
- right sidebar insight block
- status cards block
- nested cards inside nested cards

This pattern is especially forbidden for Resources, Roadmap, and learner
workspaces. Small cards and tiles are still allowed when they support the core
experience without becoming the page architecture.

Related docs:

- [Layout Principles](../ux/layout-principles.md)
- [Resources UX](../ux/resources.md)
- [Roadmap UX](../ux/roadmap.md)
- [Style Acceptance Checklist](../brand/style-acceptance-checklist.md)

### 2026-06-06: V1 Uses Top-Level Navigation Only

Status: accepted.

English OS V1 must not show per-section sidebars, nested mobile section lanes,
or fake internal pages for future feature inventory.

The active V1 navigation model is limited to:

- Dashboard
- Roadmap
- Resources
- Writing
- Speaking
- Settings

Internal sidebar ideas are deferred to V2. In V1, actions, filters, states,
tabs, and inline sections must stay inside the main page experience instead of
becoming route-backed subpages.

Related docs:

- [Navigation](../ux/navigation.md)
- [V1 Navigation Simplification Rule](../ux/v1-navigation-simplification-rule.md)
- [Information Architecture](../ux/information-architecture.md)

## Status

Active.

## Related Docs

- [ADR Template](./adr-template.md)
- [Product Thesis](../product/thesis.md)
- [V1 MVP Roadmap](../roadmap/v1-mvp-roadmap.md)
