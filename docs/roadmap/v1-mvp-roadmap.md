# V1 MVP Roadmap

## Purpose

This document defines the full path from current state to a launchable V1 MVP of English OS.

It is also the active progress tracker. Future agents should use the checkboxes to understand where work stopped and where to continue.

## How To Use This Roadmap

Before working:

1. Read [Start Here](../start.md).
2. Find the first unchecked phase or task in this file.
3. Read the related docs for that phase.
4. Continue from the first incomplete item.

After working:

1. Mark completed tasks with `[x]`.
2. Leave incomplete tasks as `[ ]`.
3. Do not mark a phase complete unless the phase completion criteria are true.
4. Update related docs if architecture, scope, UX, AI, or style decisions change.

## Current Progress Summary

- [x] Documentation foundation
- [ ] Project implementation
- [ ] Launchable V1 MVP

Current state:

The project documentation foundation is complete. Product, UX, system, engineering, AI, brand, decisions, and roadmap documentation have been created.

Implementation has started. Phase 1 foundation is complete, and the next unfinished work begins with the application shell phase.

## V1 Build Strategy

Build the MVP in this order:

1. foundation
2. app shell
3. local-first state
4. curated content model
5. dashboard
6. roadmap and resources
7. writing and speaking
8. review and recommendations
9. AI-light layer
10. polish and launch readiness

This order keeps the product usable early while preserving the system-first thesis.

## Phase 0: Documentation Foundation

Status:

- [x] Complete

Tasks:

- [x] Create docs structure
- [x] Define product thesis
- [x] Define MVP scope
- [x] Define personas
- [x] Define UX architecture
- [x] Define system model
- [x] Define engineering stack
- [x] Define AI role
- [x] Define brand/style direction
- [x] Define decision log
- [x] Define roadmap and release criteria
- [x] Create start file for future agents

Done when:

- [x] documentation is internally consistent
- [x] future agents know where to start
- [x] roadmap can be used as active progress tracker

## Phase 1: Project Foundation

Status:

- [x] Complete

Goal:

Set up the technical base.

Tasks:

- [x] Create Next.js App Router project
- [x] Configure TypeScript
- [x] Configure Tailwind CSS
- [x] Add shadcn/ui setup
- [x] Create FSD-inspired folder structure
- [x] Configure Prisma
- [x] Configure Auth.js skeleton
- [x] Add environment variable structure
- [x] Add base app routes

Done when:

- [x] app runs locally
- [x] base routes exist
- [x] folder structure matches engineering docs
- [x] auth skeleton works or is ready to wire

Related docs:

- [Tech Stack](../engineering/tech-stack.md)
- [Project Structure](../engineering/project-structure.md)
- [Frontend Architecture](../engineering/frontend-architecture.md)

## Phase 2: Application Shell

Status:

- [ ] Not started

Goal:

Build the product container.

Tasks:

- [ ] Build authenticated app layout
- [ ] Build top pill navigation
- [ ] Build vertical sidebar
- [ ] Build main content shell
- [ ] Build responsive shell behavior for desktop and mobile web
- [ ] Build route placeholders for all top-level sections
- [ ] Add shell-level motion transitions
- [ ] Add theme attributes at root level

Done when:

- [ ] user can move through the main product sections
- [ ] shell feels stable and reusable
- [ ] shell works on desktop browser and mobile web
- [ ] routes are thin and composed from widgets

Related docs:

- [Navigation](../ux/navigation.md)
- [Style Doctrine](../brand/style-doctrine.md)
- [Motion Direction](../brand/motion-direction.md)

## Phase 3: Local-First Learner State

Status:

- [ ] Not started

Goal:

Create the client-first persistence foundation.

Tasks:

- [ ] Add browser persistence adapter
- [ ] Add local learning event queue
- [ ] Add local progress state model
- [ ] Add local draft storage
- [ ] Add appearance preference storage
- [ ] Add state update helpers
- [ ] Define future sync interface

Done when:

- [ ] learner actions can update UI without backend calls
- [ ] local events are recorded consistently
- [ ] future server sync has a clear boundary

Related docs:

- [Frontend Architecture](../engineering/frontend-architecture.md)
- [API Design](../engineering/api-design.md)
- [Database Design](../engineering/database-design.md)

## Phase 4: Curated Content Model

Status:

- [ ] Not started

Goal:

Define the initial learning inventory.

Tasks:

- [ ] Define skills and subskills seed structure
- [ ] Define roadmap template data
- [ ] Define resource metadata model
- [ ] Add initial curated resources
- [ ] Define writing task model
- [ ] Define speaking prompt model
- [ ] Add recommendation context fields

Done when:

- [ ] dashboard and roadmap can be powered by structured content
- [ ] resources are not just static links
- [ ] each resource has recommendation context

Related docs:

- [Data Model](../system/data-model.md)
- [Resources UX](../ux/resources.md)
- [Roadmap UX](../ux/roadmap.md)

## Phase 5: Dashboard V1

Status:

- [ ] Not started

Goal:

Build the control center.

Tasks:

- [ ] Build learner summary widget
- [ ] Build today plan widget
- [ ] Build best next resource widget
- [ ] Build review preview widget
- [ ] Build progress snapshot widget
- [ ] Build writing and speaking quick actions
- [ ] Build recent activity widget
- [ ] Add dashboard motion and animated state updates

Done when:

- [ ] user lands on dashboard after onboarding
- [ ] dashboard answers what to do next
- [ ] dashboard uses local state and curated data

Related docs:

- [Dashboard UX](../ux/dashboard.md)
- [Progress Model](../system/progress-model.md)
- [Recommendation Logic](../system/recommendation-logic.md)

## Phase 6: Roadmap And Resources

Status:

- [ ] Not started

Goal:

Build the strategic path and curated library.

Tasks:

- [ ] Build roadmap stages and blocks UI
- [ ] Add block states
- [ ] Link roadmap blocks to resources
- [ ] Build resources page
- [ ] Build resource cards
- [ ] Add resource filters
- [ ] Add completion and reflection actions
- [ ] Add roadmap/resource animations

Done when:

- [ ] learner can follow a structured path
- [ ] learner can trust why a resource is recommended
- [ ] resource actions update progress locally

Related docs:

- [Roadmap UX](../ux/roadmap.md)
- [Resources UX](../ux/resources.md)
- [Review System](../system/review-system.md)

## Phase 7: Writing And Speaking Workspaces

Status:

- [ ] Not started

Goal:

Build the active practice zones.

Tasks:

- [ ] Build writing task list
- [ ] Build writing draft and submission flow
- [ ] Build writing feedback-ready UI
- [ ] Build speaking prompt list
- [ ] Build speaking session flow
- [ ] Build transcript-ready speaking UI
- [ ] Add local practice history
- [ ] Add workspace-specific motion

Done when:

- [ ] writing and speaking feel like real workspaces
- [ ] both can be entered from dashboard
- [ ] activity is recorded in local learning events

Related docs:

- [Writing UX](../ux/writing.md)
- [Speaking UX](../ux/speaking.md)
- [AI Writing Feedback](../ai/ai-writing-feedback.md)
- [AI Speaking Feedback](../ai/ai-speaking-feedback.md)

## Phase 8: Review And Recommendation Logic

Status:

- [ ] Not started

Goal:

Make the system guide the learner.

Tasks:

- [ ] Implement rule-based daily plan logic
- [ ] Implement best next resource logic
- [ ] Implement review queue generation
- [ ] Implement weak or neglected area signals
- [ ] Add recommendation reasons
- [ ] Connect recommendation logic to dashboard

Done when:

- [ ] dashboard can recommend a coherent daily stack
- [ ] review appears from learner behavior
- [ ] recommendations are explainable

Related docs:

- [Recommendation Logic](../system/recommendation-logic.md)
- [Review System](../system/review-system.md)
- [AI Recommendations](../ai/ai-recommendations.md)

## Phase 9: AI-Light Layer

Status:

- [ ] Not started

Goal:

Add useful AI without making AI the product.

Tasks:

- [ ] Add server-side OpenAI-compitable service boundary
- [ ] Add writing feedback service
- [ ] Add speaking feedback service
- [ ] Add recommendation explanation support
- [ ] Add structured AI response shapes
- [ ] Add AI error handling

Done when:

- [ ] AI feedback works server-side
- [ ] no provider keys are exposed to the browser
- [ ] AI outputs can be stored or shown consistently

Related docs:

- [AI Role In V1](../ai/ai-role-in-v1.md)
- [Backend Architecture](../engineering/backend-architecture.md)
- [AI Writing Feedback](../ai/ai-writing-feedback.md)

## Phase 10: Polish And Launch Readiness

Status:

- [ ] Not started

Goal:

Turn the MVP into a product that can be hosted and used.

Tasks:

- [ ] Polish responsive layouts
- [ ] Verify mobile web experience
- [ ] Verify desktop browser experience
- [ ] Polish animation and transitions
- [ ] Add empty states
- [ ] Add loading states
- [ ] Add error states
- [ ] Verify theme settings
- [ ] Deploy to Vercel
- [ ] Review seed data
- [ ] Run basic QA

Done when:

- [ ] MVP meets release criteria
- [ ] core flows work end to end
- [ ] product feels like English OS, not a technical demo

Related docs:

- [Release Criteria](./release-criteria.md)
- [Style Doctrine](../brand/style-doctrine.md)
- [Theme System](../brand/theme-system.md)

## Scope Guardrails

Do not add these before V1 is coherent:

- social features
- user-submitted resources
- giant lesson library
- advanced adaptive AI roadmap rebuilding
- separate backend server

## Status

Active.

## Related Docs

- [Start Here](../start.md)
- [Milestones](./milestones.md)
- [Workstreams](./workstreams.md)
- [Release Criteria](./release-criteria.md)
- [MVP Definition](../product/mvp.md)
