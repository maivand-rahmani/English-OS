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

Implementation has moved beyond the first dashboard pass. Overview surfaces now exist for dashboard, roadmap, resources, writing, speaking, and settings, but they have not yet been fully audited against the phase checklists below.

Phases 1, 2, 3, 4, and 5 are reopened for mobile design backlog. Desktop and early responsive behavior exist, but intentional phone-first mobile design remains unfinished across V1. The next tracked build work still begins with roadmap and resources, now with explicit mobile obligations.

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

- [ ] Reopened for mobile design backlog

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

Mobile version:

- [ ] Define phone-first viewport and safe-area expectations for V1 app surfaces
- [ ] Define touch target baseline for mobile interactive controls
- [ ] Define mobile token expectations for spacing, typography, density, and motion

Done when:

- [x] app runs locally
- [x] base routes exist
- [x] folder structure matches engineering docs
- [x] auth skeleton works or is ready to wire
- [ ] foundation treats mobile web as a first-pass target, not a late CSS patch
- [ ] mobile viewport and safe-area assumptions are explicit enough for future UI implementation
- [ ] touch target and token constraints are documented for future section work

Related docs:

- [Tech Stack](../engineering/tech-stack.md)
- [Project Structure](../engineering/project-structure.md)
- [Frontend Architecture](../engineering/frontend-architecture.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

## Phase 2: Application Shell

Status:

- [ ] Reopened for mobile design backlog

Goal:

Build the product container.

Tasks:

- [x] Build authenticated app layout
- [x] Build top pill navigation
- [x] Build vertical sidebar
- [x] Build main content shell
- [x] Build responsive shell behavior for desktop and mobile web
- [x] Build route placeholders for all top-level sections
- [x] Add shell-level motion transitions
- [x] Add theme attributes at root level

Mobile version:

- [ ] Define bottom navigation for top-level sections on phone
- [ ] Define top chips or segmented local section lanes for mobile section structure
- [ ] Define compact mobile header, utility priority, and collapsible secondary navigation behavior
- [ ] Define how desktop rail behavior transforms on phone instead of persisting unchanged

Done when:

- [x] user can move through the main product sections
- [x] shell feels stable and reusable
- [x] shell works on desktop browser and mobile web
- [x] routes are thin and composed from widgets
- [ ] mobile shell is intentional on phone, not a squeezed desktop shell
- [ ] phone navigation hierarchy is clear between global sections and local section lanes
- [ ] mobile header and utility controls stay compact and calm

Related docs:

- [Navigation](../ux/navigation.md)
- [Style Doctrine](../brand/style-doctrine.md)
- [Motion Direction](../brand/motion-direction.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

## Phase 3: Local-First Learner State

Status:

- [ ] Reopened for mobile design backlog

Goal:

Create the client-first persistence foundation.

Tasks:

- [x] Add browser persistence adapter
- [x] Add local learning event queue
- [x] Add local progress state model
- [x] Add local draft storage
- [x] Add appearance preference storage
- [x] Add state update helpers
- [x] Define future sync interface

Mobile version:

- [ ] Define short-session continuity rules for phone usage
- [ ] Define background and return behavior for local draft, progress, and event persistence
- [ ] Define interrupted action expectations for mobile resume states

Done when:

- [x] learner actions can update UI without backend calls
- [x] local events are recorded consistently
- [x] future server sync has a clear boundary
- [ ] mobile session interruption does not break learner continuity assumptions
- [ ] local draft and progress persistence are explicitly safe for short mobile sessions
- [ ] resume behavior is clear enough for future workflow implementation

Related docs:

- [Frontend Architecture](../engineering/frontend-architecture.md)
- [API Design](../engineering/api-design.md)
- [Database Design](../engineering/database-design.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

## Phase 4: Curated Content Model

Status:

- [ ] Reopened for mobile design backlog

Goal:

Define the initial learning inventory.

Tasks:

- [x] Define skills and subskills seed structure
- [x] Define roadmap template data
- [x] Define resource metadata model
- [x] Add initial curated resources
- [x] Define writing task model
- [x] Define speaking prompt model
- [x] Add recommendation context fields

Mobile version:

- [ ] Define mobile content-fit checks for labels, metadata density, and compact card summaries
- [ ] Define how title, type, skill, time, why-now, and action-after remain visible in compact layouts
- [ ] Define compact recommendation reason behavior for narrow widths

Done when:

- [x] dashboard and roadmap can be powered by structured content
- [x] resources are not just static links
- [x] each resource has recommendation context
- [ ] curated content can be rendered on phone without losing guidance
- [ ] compact cards still preserve recommendation trust signals
- [ ] label and metadata expectations are explicit enough for future UI implementation

Related docs:

- [Data Model](../system/data-model.md)
- [Resources UX](../ux/resources.md)
- [Roadmap UX](../ux/roadmap.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

## Phase 5: Dashboard V1

Status:

- [ ] Reopened for mobile design backlog

Goal:

Build the control center.

Tasks:

- [x] Build learner summary widget
- [x] Build today plan widget
- [x] Build best next resource widget
- [x] Build review preview widget
- [x] Build progress snapshot widget
- [x] Build writing and speaking quick actions
- [x] Build recent activity widget
- [x] Add dashboard motion and animated state updates

Mobile version:

- [ ] Define phone hierarchy with one dominant next action and stacked support modules
- [ ] Define mobile dashboard order for today plan, progress snapshot, best next resource, review, writing and speaking, and recent activity
- [ ] Define reduced simultaneous density for phone while preserving meaningful progress visibility

Done when:

- [x] user lands on dashboard after onboarding
- [x] dashboard answers what to do next
- [x] dashboard uses local state and curated data
- [ ] dashboard still answers "what do I do now?" within one or two mobile scrolls
- [ ] progress snapshot remains visible and meaningful on phone
- [ ] dashboard hierarchy avoids equal-weight widget walls on narrow screens

Related docs:

- [Dashboard UX](../ux/dashboard.md)
- [Progress Model](../system/progress-model.md)
- [Recommendation Logic](../system/recommendation-logic.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

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

Mobile version:

- [ ] Define mobile roadmap flow with active stage first, sequential blocks, and compact state chips
- [ ] Define mobile resources flow with featured resource first and full-width primary actions
- [ ] Define filter sheet or modal pattern for resource filtering on phone
- [ ] Define how recommendation reason stays above the fold on narrow cards

Done when:

- [ ] learner can follow a structured path
- [ ] learner can trust why a resource is recommended
- [ ] resource actions update progress locally
- [ ] roadmap reads top-to-bottom on phone without relying on side-by-side desktop structure
- [ ] resources feel guided and trustworthy on phone
- [ ] filters and CTAs remain touch-friendly and easy to understand on mobile

Related docs:

- [Roadmap UX](../ux/roadmap.md)
- [Resources UX](../ux/resources.md)
- [Review System](../system/review-system.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

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

Mobile version:

- [ ] Define task-first and prompt-first stacked practice flows for phone
- [ ] Define mobile draft, feedback, transcript, and history hierarchy
- [ ] Define dominant mobile entry actions for writing and speaking sessions

Done when:

- [ ] writing and speaking feel like real workspaces
- [ ] both can be entered from dashboard
- [ ] activity is recorded in local learning events
- [ ] writing and speaking flows remain usable and low-friction on phone
- [ ] active practice stays dominant over secondary history or support panels on mobile

Related docs:

- [Writing UX](../ux/writing.md)
- [Speaking UX](../ux/speaking.md)
- [AI Writing Feedback](../ai/ai-writing-feedback.md)
- [AI Speaking Feedback](../ai/ai-speaking-feedback.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

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

Mobile version:

- [ ] Define compact recommendation explanation hierarchy for phone
- [ ] Define mobile review surfaces that stay readable without deep panel layouts

Done when:

- [ ] dashboard can recommend a coherent daily stack
- [ ] review appears from learner behavior
- [ ] recommendations are explainable
- [ ] recommendation reasons remain understandable in compact mobile layouts
- [ ] mobile review surfaces keep the next action obvious

Related docs:

- [Recommendation Logic](../system/recommendation-logic.md)
- [Review System](../system/review-system.md)
- [AI Recommendations](../ai/ai-recommendations.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

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

Mobile version:

- [ ] Define readable mobile AI response blocks for writing, speaking, and recommendation surfaces
- [ ] Define compact mobile-safe AI failure and recovery states

Done when:

- [ ] AI feedback works server-side
- [ ] no provider keys are exposed to the browser
- [ ] AI outputs can be stored or shown consistently
- [ ] AI feedback panels remain readable and calm on phone
- [ ] AI failure states are understandable without overwhelming mobile layouts

Related docs:

- [AI Role In V1](../ai/ai-role-in-v1.md)
- [Backend Architecture](../engineering/backend-architecture.md)
- [AI Writing Feedback](../ai/ai-writing-feedback.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

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

Mobile version:

- [ ] Run phone-specific QA for touch comfort, readability, and layout hierarchy
- [ ] Verify mobile-safe loading, empty, and error states across core sections
- [ ] Verify phone-first polish for motion, spacing, and compact copy

Done when:

- [ ] MVP meets release criteria
- [ ] core flows work end to end
- [ ] product feels like English OS, not a technical demo
- [ ] phone usability is a launch gate, not an afterthought
- [ ] touch targets, hierarchy, and responsive polish are acceptable across V1

Related docs:

- [Release Criteria](./release-criteria.md)
- [Style Doctrine](../brand/style-doctrine.md)
- [Theme System](../brand/theme-system.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

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
- [Mobile V1 Design](../ux/mobile-v1-design.md)
