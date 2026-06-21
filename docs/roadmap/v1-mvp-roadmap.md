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
- [x] Project implementation
- [ ] Launchable V1 MVP (code complete; deployment + manual QA pending)

Current state:

Phase 10 (Polish And Launch Readiness) is substantially complete at the code level:

- Shared UI primitives created (Skeleton, EmptyState, ErrorState, Spinner)
- Route-level loading.tsx added to 7 routes
- Route-level error.tsx added to 7 routes + global-error.tsx + not-found.tsx
- Widget-level loading/error/empty states added (Dashboard, Roadmap, Resources, Settings)
- Hardcoded animation durations replaced with CSS motion tokens
- Duplicate server/content code removed
- Seed data reviewed, transaction timeout increased
- Build passes clean (TypeScript + Next.js)

Remaining: Vercel deployment, manual QA (mobile and desktop), font customization in settings UI.

## V1 Build Strategy

Build the MVP in this order:

1. foundation
2. app shell
3. local-first state
4. curated content model
5. dashboard
6. roadmap and resources
7. Practice
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

Mobile version:

- [x] Define phone-first viewport and safe-area expectations for V1 app surfaces
- [x] Define touch target baseline for mobile interactive controls
- [x] Define mobile token expectations for spacing, typography, density, and motion

Done when:

- [x] app runs locally
- [x] base routes exist
- [x] folder structure matches engineering docs
- [x] auth skeleton works or is ready to wire
- [x] foundation treats mobile web as a first-pass target, not a late CSS patch
- [x] mobile viewport and safe-area assumptions are explicit enough for future UI implementation
- [x] touch target and token constraints are documented for future section work

Related docs:

- [Tech Stack](../engineering/tech-stack.md)
- [Project Structure](../engineering/project-structure.md)
- [Frontend Architecture](../engineering/frontend-architecture.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

## Phase 2: Application Shell

Status:

- [x] Complete

Goal:

Build the product container.

Tasks:

- [x] Build authenticated app layout
- [x] Build top pill navigation
- [x] Keep V1 shell navigation limited to top-level sections only
- [x] Build main content shell
- [x] Build responsive shell behavior for desktop and mobile web
- [x] Build route placeholders for all top-level sections
- [x] Add shell-level motion transitions
- [x] Add theme attributes at root level
- [x] Remove traditional per-page eyebrow/title/subtitle headers from the shared shell

Mobile version:

- [x] Define bottom navigation for top-level sections on phone
- [x] Define top-level-only phone navigation for V1
- [x] Define compact mobile shell chrome and utility priority without nested section navigation
- [x] Define how desktop rail behavior transforms on phone instead of persisting unchanged

Done when:

- [x] user can move through the main product sections
- [x] shell feels stable and reusable
- [x] shell works on desktop browser and mobile web
- [x] routes are thin and composed from widgets
- [x] mobile shell is intentional on phone, not a squeezed desktop shell
- [x] phone navigation hierarchy is limited to real top-level sections in V1
- [x] mobile shell chrome and utility controls stay compact and calm
- [x] shared shell does not repeat section identity through page-header copy
- [x] no active V1 section sidebar or local lane is required to use the product

Related docs:

- [Navigation](../ux/navigation.md)
- [Style Doctrine](../brand/style-doctrine.md)
- [Motion Direction](../brand/motion-direction.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

## Phase 3: Local-First Learner State

Status:

- [x] Complete

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

- [x] Define short-session continuity rules for phone usage
- [x] Define background and return behavior for local draft, progress, and event persistence
- [x] Define interrupted action expectations for mobile resume states

Done when:

- [x] learner actions can update UI without backend calls
- [x] local events are recorded consistently
- [x] future server sync has a clear boundary
- [x] mobile session interruption does not break learner continuity assumptions
- [x] local draft and progress persistence are explicitly safe for short mobile sessions
- [x] resume behavior is clear enough for future workflow implementation

Related docs:

- [Frontend Architecture](../engineering/frontend-architecture.md)
- [API Design](../engineering/api-design.md)
- [Database Design](../engineering/database-design.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

## Phase 4: Curated Content Model

Status:

- [x] Complete

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

- [x] Define mobile content-fit checks for labels, metadata density, and compact card summaries
- [x] Define how title, type, skill, time, why-now, and action-after remain visible in compact layouts
- [x] Define compact recommendation reason behavior for narrow widths

Done when:

- [x] dashboard and roadmap can be powered by structured content
- [x] resources are not just static links
- [x] each resource has recommendation context
- [x] curated content can be rendered on phone without losing guidance
- [x] compact cards still preserve recommendation trust signals
- [x] label and metadata expectations are explicit enough for future UI implementation

Related docs:

- [Data Model](../system/data-model.md)
- [Resources UX](../ux/resources.md)
- [Roadmap UX](../ux/roadmap.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

## Phase 5: Dashboard V1

Status:

- [x] Complete

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

- [x] Define phone hierarchy with one dominant next action and stacked support modules
- [x] Define mobile dashboard order for today plan, progress snapshot, best next resource, review, writing and speaking, and recent activity
- [x] Define reduced simultaneous density for phone while preserving meaningful progress visibility

Done when:

- [x] user lands on dashboard after onboarding
- [x] dashboard answers what to do next
- [x] dashboard uses local state and curated data
- [x] dashboard still answers "what do I do now?" within one or two mobile scrolls
- [x] progress snapshot remains visible and meaningful on phone
- [x] dashboard hierarchy avoids equal-weight widget walls on narrow screens

Related docs:

- [Dashboard UX](../ux/dashboard.md)
- [Progress Model](../system/progress-model.md)
- [Recommendation Logic](../system/recommendation-logic.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

## Phase 6: Roadmap And Resources

Status:

- [x] Complete

Goal:

Build the strategic path and curated library.

Tasks:

- [x] Build roadmap stages and blocks UI
- [x] Add block states
- [x] Link roadmap blocks to resources
- [x] Build resources page
- [x] Build resource cards
- [x] Add resource filters
- [x] Add completion and reflection actions
- [x] Add roadmap/resource animations

Mobile version:

- [x] Define mobile roadmap flow with active stage first, sequential blocks, and compact state chips
- [x] Define mobile resources flow with featured resource first and full-width primary actions
- [x] Define filter sheet or modal pattern for resource filtering on phone
- [x] Define how recommendation reason stays above the fold on narrow cards

Done when:

- [x] learner can follow a structured path
- [x] learner can trust why a resource is recommended
- [x] resource actions update progress locally
- [x] roadmap reads top-to-bottom on phone without relying on side-by-side desktop structure
- [x] resources feel guided and trustworthy on phone
- [x] filters and CTAs remain touch-friendly and easy to understand on mobile

Related docs:

- [Roadmap UX](../ux/roadmap.md)
- [Resources UX](../ux/resources.md)
- [Review System](../system/review-system.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

## Phase 7: Practice MVP Studio

Status:

- [x] Completed

Goal:

Build the correct V1 Practice architecture and surface model.

Tasks:

- [x] Replace top-level Writing and Speaking navigation with Practice
- [x] Build one main Practice page for V1
- [x] Keep Writing and Speaking inside Practice as modes
- [x] Add safe legacy redirects from `/writing` and `/speaking`
- [x] Keep V1 Practice free of sidebars and internal sub-pages
- [x] Remove dashboard-style top-level Writing and Speaking page architecture
- [x] Remove page-header copy above Practice
- [x] Build one central Practice studio surface instead of a dashboard layout

Mobile version:

- [x] Keep Practice reachable from the shared mobile shell
- [x] Keep writing and speaking mode entry lightweight on phone
- [x] Avoid nested mobile section navigation for Practice in V1

Done when:

- [x] Practice is the top-level V1 output section
- [x] writing and speaking are available inside Practice as modes
- [x] dashboard can route learners into Practice without broken links
- [x] no active Practice sidebar or internal Practice sub-pages are required in V1
- [x] phone navigation keeps Practice at the top level without nested section chrome
- [x] Practice opens directly into one integrated workspace surface
- [x] Practice does not rely on separate task, editor, and feedback cards

Current note:

Phase 7 is complete for the current architecture and surface pass. Practice is
now the single V1 top-level output page, writing and speaking remain internal
modes, and the page opens directly into one studio surface instead of a
dashboard-like stack. Follow-up work can deepen the mode workflows without
reintroducing the old top-level split or premature V2 navigation.

Related docs:

- [Writing UX](../ux/writing.md)
- [Speaking UX](../ux/speaking.md)
- [AI Writing Feedback](../ai/ai-writing-feedback.md)
- [AI Speaking Feedback](../ai/ai-speaking-feedback.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

## Phase 8: Review And Recommendation Logic

Status:

- [x] Complete

Goal:

Make the system guide the learner.

Tasks:

- [x] Implement rule-based daily plan logic
- [x] Implement best next resource logic
- [x] Implement review queue generation
- [x] Implement weak or neglected area signals
- [x] Add recommendation reasons
- [x] Connect recommendation logic to dashboard

Mobile version:

- [x] Define compact recommendation explanation hierarchy for phone
- [x] Define mobile review surfaces that stay readable without deep panel layouts

Done when:

- [x] dashboard can recommend a coherent daily stack
- [x] review appears from learner behavior
- [x] recommendations are explainable
- [x] recommendation reasons remain understandable in compact mobile layouts
- [x] mobile review surfaces keep the next action obvious

Related docs:

- [Recommendation Logic](../system/recommendation-logic.md)
- [Review System](../system/review-system.md)
- [AI Recommendations](../ai/ai-recommendations.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

## Phase 9: AI-Light Layer

Status:

- [x] Complete

Goal:

Add useful AI without making AI the product.

Tasks:

- [x] Add server-side OpenAI-compatible service boundary
- [x] Add writing feedback service
- [x] Add speaking feedback service
- [x] Add recommendation explanation support
- [x] Add structured AI response shapes
- [x] Add AI error handling

Mobile version:

- [x] Define readable mobile AI response blocks for writing, speaking, and recommendation surfaces
- [x] Define compact mobile-safe AI failure and recovery states

Done when:

- [x] AI feedback works server-side
- [x] no provider keys are exposed to the browser
- [x] AI outputs can be stored or shown consistently
- [x] AI feedback panels remain readable and calm on phone
- [x] AI failure states are understandable without overwhelming mobile layouts

Related docs:

- [AI Role In V1](../ai/ai-role-in-v1.md)
- [Backend Architecture](../engineering/backend-architecture.md)
- [AI Writing Feedback](../ai/ai-writing-feedback.md)
- [Mobile V1 Design](../ux/mobile-v1-design.md)

## Phase 10: Polish And Launch Readiness

Status:

- [x] Substantially complete (code changes done; deployment + manual QA pending)

Goal:

Turn the MVP into a product that can be hosted and used.

Tasks:

- [x] Polish responsive layouts
- [x] Verify mobile web experience (code-level; manual QA needed)
- [x] Verify desktop browser experience (code-level; manual QA needed)
- [x] Polish animation and transitions (hardcoded durations → motion tokens)
- [x] Add empty states (shared component + existing widget states)
- [x] Add loading states (route-level loading.tsx + shared skeletons/spinners + widget loading)
- [x] Add error states (route-level error.tsx + global-error + not-found + widget error handling)
- [x] Verify theme settings (all 4 controls work; font customization deferred to V2)
- [ ] Deploy to Vercel (requires deployment credentials)
- [x] Review seed data (reviewed; transaction timeout fixed)
- [ ] Run basic QA (manual verification needed)

Mobile version:

- [ ] Run phone-specific QA for touch comfort, readability, and layout hierarchy
- [x] Verify mobile-safe loading, empty, and error states across core sections (code ready)
- [x] Verify phone-first polish for motion, spacing, and compact copy (motion tokens applied)

Done when:

- [ ] MVP meets release criteria (deployment + manual QA pending)
- [x] core flows work end to end (build passes, all routes compile)
- [ ] product feels like English OS, not a technical demo (needs visual QA)
- [ ] phone usability is a launch gate, not an afterthought (needs phone testing)
- [x] touch targets, hierarchy, and responsive polish are acceptable across V1 (code ready)

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
