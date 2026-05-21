# V2 MVP Roadmap

## Purpose

This document defines the post-V1 expansion path for English OS.

V2 is where the product grows from one primary page per major section into a deeper application with route-backed subpages and full section-specific workflows.

## V2 Premise

V2 begins only after V1 is fully complete.

That means:

- all V1 phases are done
- V1 launch criteria are true
- unfinished V1 tasks are not moved into V2
- V2 is treated as the next coherent product expansion, not a place to hide missing MVP work

## V2 Summary

The core V2 job is to turn each major product section into a multi-page workspace without losing the system-first English OS structure.

The product should still keep:

- Dashboard as the daily command center
- Roadmap as the strategic layer
- Resources as the curated library
- Writing and Speaking as active practice workspaces
- Settings as the configuration layer

The difference is that each section now gains real internal pages with focused workflows, deeper continuity, and stronger deep-linking.

## Active Tracker Rule

This document is not the active implementation tracker while V1 is incomplete.

[V1 MVP Roadmap](../v1-mvp-roadmap.md) remains the canonical progress tracker until V1 is fully complete.

## Core V2 Routing Rule

In V2:

- root top-level routes remain as section overview or command views
- local sidebar items become real route-backed subpages
- subpages must be full workflow surfaces, not just alternate filters of the same page
- deep links should be able to open the exact place where work continues

The root sections should not disappear.

They remain the section entry views above the deeper workflow pages.

## V2 URL Contract

### Dashboard

- `/dashboard`
- `/dashboard/today`
- `/dashboard/this-week`
- `/dashboard/review`
- `/dashboard/weak-areas`
- `/dashboard/recent-activity`

### Roadmap

- `/roadmap`
- `/roadmap/current-stage`
- `/roadmap/upcoming`
- `/roadmap/grammar`
- `/roadmap/vocabulary`
- `/roadmap/reading`
- `/roadmap/listening`
- `/roadmap/milestones`

### Resources

- `/resources`
- `/resources/recommended`
- `/resources/collections`
- `/resources/beginner`
- `/resources/intermediate`
- `/resources/grammar`
- `/resources/vocabulary`
- `/resources/listening`
- `/resources/reading`
- `/resources/speaking`
- `/resources/writing`

### Writing

- `/writing`
- `/writing/tasks`
- `/writing/new-draft`
- `/writing/feedback`
- `/writing/mistakes`
- `/writing/history`

### Speaking

- `/speaking`
- `/speaking/prompts`
- `/speaking/record`
- `/speaking/feedback`
- `/speaking/reflection`
- `/speaking/history`

### Settings

- `/settings`
- `/settings/profile`
- `/settings/goals`
- `/settings/preferences`
- `/settings/notifications`
- `/settings/account`

### Auth And Onboarding

Auth should support at minimum:

- `/sign-in`
- `/auth/pending`
- `/auth/error`

Onboarding should expand into route-backed steps:

- `/onboarding`
- `/onboarding/level`
- `/onboarding/goal`
- `/onboarding/study-time`
- `/onboarding/strengths-weaknesses`
- `/onboarding/preferred-formats`
- `/onboarding/pain-point`
- `/onboarding/summary`

## Cross-Linking And Behavior Rules

V2 should support much stronger direct navigation between product surfaces.

Rules:

- dashboard cards should link to the exact subpage or workflow entry they refer to
- roadmap blocks should open the related roadmap subpage, resource view, or practice workspace directly
- resource cards should open not only external destinations but also the exact English OS follow-up surface
- writing and speaking actions should reopen the current task, draft, recording flow, feedback view, or history entry directly
- section sidebars should reflect real navigation state, not decorative labels

## Mobile Rule

V2 subpages must not be desktop-only.

Each new subpage should have:

- a mobile-first sequential flow
- preserved English OS shell continuity
- readable priority order
- touch-friendly navigation between subpages
- focused layouts rather than compressed desktop dashboards

## V2 Build Strategy

Build V2 in this order:

1. subpage architecture foundation
2. dashboard workflow pages
3. roadmap workflow pages
4. resources workflow pages
5. writing workflow pages
6. speaking workflow pages
7. settings workflow pages
8. auth and onboarding expansion
9. cross-linking, continuity, and polish

## Phase 0: Subpage Architecture Foundation

Status:

- [ ] Not started

Goal:

Create the routing and shell rules that let section sidebars become real navigation instead of static local lists.

Tasks:

- [ ] Define nested routing structure for route-backed section subpages
- [ ] Define sidebar-to-route mapping rules for all major sections
- [ ] Define root section page role as overview or command view
- [ ] Define deep-linking rules for reopening exact workflow entries
- [ ] Define section-level URL and state persistence rules
- [ ] Define mobile navigation behavior for subpage-heavy sections

Done when:

- [ ] every sidebar item has a clear route contract
- [ ] root pages and subpages have non-overlapping roles
- [ ] nested routing rules are consistent across sections
- [ ] mobile and desktop navigation behavior are both defined

Related docs:

- [Information Architecture](../../ux/information-architecture.md)
- [Navigation](../../ux/navigation.md)
- [Frontend Architecture](../../engineering/frontend-architecture.md)

## Phase 1: Dashboard Subpages

Status:

- [ ] Not started

Goal:

Turn Dashboard from one command-center page into a set of focused daily workflow pages.

Tasks:

- [ ] Build `/dashboard/today` as the primary daily execution surface
- [ ] Build `/dashboard/this-week` as a continuity and pacing view
- [ ] Build `/dashboard/review` as the deeper review-entry surface
- [ ] Build `/dashboard/weak-areas` as a focused improvement view
- [ ] Build `/dashboard/recent-activity` as session continuity and history entry
- [ ] Preserve `/dashboard` as the section overview and command-center return point
- [ ] Add deep links from overview cards into exact dashboard subpages

Done when:

- [ ] dashboard root works as a command view rather than duplicating every subpage
- [ ] each dashboard subpage answers a distinct daily decision
- [ ] the learner can move from dashboard overview into focused follow-up views without friction
- [ ] dashboard subpages are more than filtered cards from one page

Related docs:

- [Dashboard](../../ux/dashboard.md)
- [Navigation](../../ux/navigation.md)
- [Review System](../../system/review-system.md)
- [Progress Model](../../system/progress-model.md)

## Phase 2: Roadmap Subpages

Status:

- [ ] Not started

Goal:

Expand Roadmap into a deeper strategic workspace with route-backed views for progression, skills, and milestones.

Tasks:

- [ ] Build `/roadmap/current-stage` for active stage execution
- [ ] Build `/roadmap/upcoming` for near-future path visibility
- [ ] Build `/roadmap/grammar` and `/roadmap/vocabulary` as skill-focused roadmap views
- [ ] Build `/roadmap/reading` and `/roadmap/listening` as applied skill-track views
- [ ] Build `/roadmap/milestones` as progress landmark and checkpoint view
- [ ] Preserve `/roadmap` as the strategic overview page
- [ ] Define direct routes from roadmap blocks into linked resources and practice tasks

Done when:

- [ ] roadmap supports both stage-first and skill-first navigation
- [ ] current and upcoming work are separated clearly
- [ ] milestones have a dedicated interpretation surface
- [ ] roadmap subpages feel like workflow areas, not duplicate filters

Related docs:

- [Roadmap UX](../../ux/roadmap.md)
- [Navigation](../../ux/navigation.md)
- [Recommendation Logic](../../system/recommendation-logic.md)

## Phase 3: Resources Subpages

Status:

- [ ] Not started

Goal:

Turn Resources into a structured editorial library with route-backed entry points by recommendation, collection, level, and skill.

Tasks:

- [ ] Build `/resources/recommended` as the highest-trust personalized entry
- [ ] Build `/resources/collections` as the editorial browsing surface
- [ ] Build `/resources/beginner` and `/resources/intermediate` as level-focused pages
- [ ] Build skill-focused pages for grammar, vocabulary, listening, reading, speaking, and writing
- [ ] Preserve `/resources` as the overview and discovery start page
- [ ] Define how recommendation context, why-now logic, and follow-up actions appear inside each subpage
- [ ] Define routes from roadmap and dashboard into exact resource subpages or cards

Done when:

- [ ] resource browsing is organized by real user intent, not only one generic list
- [ ] recommendation context survives across deeper routes
- [ ] level and skill pages serve different jobs cleanly
- [ ] resources subpages remain editorial and guided rather than database-like

Related docs:

- [Resources UX](../../ux/resources.md)
- [Navigation](../../ux/navigation.md)
- [Recommendation Logic](../../system/recommendation-logic.md)

## Phase 4: Writing Workflow Pages

Status:

- [ ] Not started

Goal:

Expand Writing into a multi-page active workspace with clear task, draft, feedback, mistake, and history flows.

Tasks:

- [ ] Build `/writing/tasks` as the task list and task-entry view
- [ ] Build `/writing/new-draft` as the active drafting surface
- [ ] Build `/writing/feedback` as the feedback and rewrite loop view
- [ ] Build `/writing/mistakes` as the repeated-pattern review page
- [ ] Build `/writing/history` as the continuity and archive view
- [ ] Preserve `/writing` as the overview and workspace entry page
- [ ] Define direct reopening of exact drafts, feedback states, and history entries

Done when:

- [ ] writing has a clear start-to-feedback workflow across routes
- [ ] draft continuation is route-backed and recoverable
- [ ] mistake review is separated from single-draft feedback
- [ ] writing history helps the learner continue, not only archive old work

Related docs:

- [Writing UX](../../ux/writing.md)
- [AI Writing Feedback](../../ai/ai-writing-feedback.md)
- [Progress Model](../../system/progress-model.md)

## Phase 5: Speaking Workflow Pages

Status:

- [ ] Not started

Goal:

Expand Speaking into a route-backed practice workspace with clear transitions between prompts, recording, feedback, reflection, and history.

Tasks:

- [ ] Build `/speaking/prompts` as the session-entry view
- [ ] Build `/speaking/record` as the active recording surface
- [ ] Build `/speaking/feedback` as the post-session feedback page
- [ ] Build `/speaking/reflection` as the learner reflection surface
- [ ] Build `/speaking/history` as the continuity and archive view
- [ ] Preserve `/speaking` as the overview and workspace entry page
- [ ] Define reopening rules for prompt, recording, transcript, feedback, and history continuity

Done when:

- [ ] speaking supports a repeatable route-backed session flow
- [ ] recording and post-session review are clearly separated
- [ ] reflection is treated as its own product moment
- [ ] history supports confidence-building continuity across sessions

Related docs:

- [Speaking UX](../../ux/speaking.md)
- [AI Speaking Feedback](../../ai/ai-speaking-feedback.md)
- [Progress Model](../../system/progress-model.md)

## Phase 6: Settings Workflow Pages

Status:

- [ ] Not started

Goal:

Turn Settings into a real multi-page control area with dedicated preference and account surfaces.

Tasks:

- [ ] Build `/settings/profile`
- [ ] Build `/settings/goals`
- [ ] Build `/settings/preferences`
- [ ] Build `/settings/notifications`
- [ ] Build `/settings/account`
- [ ] Preserve `/settings` as the overview and settings home
- [ ] Define how appearance, study, and reminder preferences affect the rest of the system visibly

Done when:

- [ ] each settings subpage owns a clear configuration job
- [ ] appearance and learning preferences are not mixed into one catch-all form
- [ ] settings changes can be understood in terms of product impact
- [ ] settings remains calm and focused rather than becoming a feature dump

Related docs:

- [Settings UX](../../ux/settings.md)
- [Theme System](../../brand/theme-system.md)
- [Onboarding](../../ux/onboarding.md)

## Phase 7: Auth And Onboarding Expansion

Status:

- [ ] Not started

Goal:

Expand authentication and onboarding into route-backed, recoverable multi-step flows.

Tasks:

- [ ] Preserve `/sign-in` as the main auth entry
- [ ] Add `/auth/pending` for in-progress auth transitions
- [ ] Add `/auth/error` for explicit auth failure handling
- [ ] Expand onboarding into route-backed steps for level, goal, study time, strengths and weaknesses, preferred formats, pain point, and summary
- [ ] Define resume behavior for interrupted onboarding
- [ ] Define how onboarding summary hands off into the first live dashboard state

Done when:

- [ ] auth has explicit pending and error states
- [ ] onboarding is step-based and resumable
- [ ] onboarding steps map directly to the required learner profile inputs
- [ ] the final onboarding handoff creates a meaningful first-dashboard state

Related docs:

- [Onboarding](../../ux/onboarding.md)
- [Navigation](../../ux/navigation.md)
- [MVP Definition](../../product/mvp.md)

## Phase 8: Cross-Linking, Continuity, And Polish

Status:

- [ ] Not started

Goal:

Make the deeper V2 route system feel like one coherent operating system instead of disconnected internal pages.

Tasks:

- [ ] Add exact deep links between dashboard, roadmap, resources, writing, speaking, settings, and onboarding states
- [ ] Define return-path behavior between overview pages and workflow subpages
- [ ] Polish mobile subpage navigation and sequential flows
- [ ] Polish shell continuity across nested routes
- [ ] Add loading, empty, and error states for subpage-heavy workflows
- [ ] Review whether any subpage still behaves like a thin filtered duplicate instead of a real workflow area

Done when:

- [ ] moving across subpages feels continuous
- [ ] mobile and desktop both support deep workflows cleanly
- [ ] cross-links open exact relevant workflow entries
- [ ] V2 feels like a coherent deeper English OS, not a set of unrelated nested routes

Related docs:

- [Navigation](../../ux/navigation.md)
- [Information Architecture](../../ux/information-architecture.md)
- [Style Doctrine](../../brand/style-doctrine.md)
- [Motion Direction](../../brand/motion-direction.md)

## Review Checklist

When using this roadmap:

- verify that V2 work does not replace unfinished V1 obligations
- verify that every new subpage comes from an already defined UX need
- verify that root section pages remain useful overview surfaces
- verify that sidebar navigation is route-backed rather than decorative
- verify that mobile behavior is designed intentionally for every subpage
- verify that deeper routes create clearer workflows rather than duplicating the same layout with different filters

## Status

Future planning document, active.

## Related Docs

- [Roadmap Futures](./README.md)
- [V1 MVP Roadmap](../v1-mvp-roadmap.md)
- [Navigation](../../ux/navigation.md)
- [Information Architecture](../../ux/information-architecture.md)
