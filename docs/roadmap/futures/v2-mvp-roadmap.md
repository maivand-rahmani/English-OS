# V2 MVP Roadmap

## Purpose

This document defines the post-V1 expansion path for English OS.

V2 is where the product grows from one primary page per major section into a deeper application with selective route-backed workflows and full section-specific work areas.

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
- Practice as the active output section, with Writing and Speaking as internal workspaces
- Settings as the configuration layer

The difference is that selected sections now gain real internal pages with focused workflows, deeper continuity, and stronger deep-linking.

V2 does not mean restoring every old placeholder sidebar item as a route.

It means promoting only the internal surfaces that prove they need their own workflow page.

## Active Tracker Rule

This document is not the active implementation tracker while V1 is incomplete.

[V1 MVP Roadmap](../v1-mvp-roadmap.md) remains the canonical progress tracker until V1 is fully complete.

## Core V2 Routing Rule

In V2:

- root top-level routes remain as section overview or command views
- only distinct workflow surfaces become route-backed internal pages
- filters, actions, tabs, and lightweight sections stay inline or in URL state unless they become full workflow surfaces
- any section-level navigation must stay smaller and more intentional than the old V1 placeholder lists
- deep links should be able to open the exact place where work continues

The root sections should not disappear.

They remain the section entry views above the deeper workflow pages.

## V2 URL Contract

### Dashboard

- `/dashboard`
- `/dashboard/review`
- `/dashboard/insights`
- `/dashboard/activity`

### Roadmap

- `/roadmap`
- `/roadmap/stages/[stageSlug]`
- `/roadmap/skills/[skillSlug]`
- `/roadmap/milestones`

### Resources

- `/resources`
- `/resources/collections`
- `/resources/collections/[collectionSlug]`
- `/resources/library/[resourceSlug]`
- `/resources/follow-up`

### Practice

- `/practice`
- `/practice/writing`
- `/practice/writing/tasks`
- `/practice/writing/tasks/[taskId]`
- `/practice/writing/drafts/[draftId]`
- `/practice/writing/submissions/[submissionId]`
- `/practice/writing/history`
- `/practice/speaking`
- `/practice/speaking/prompts`
- `/practice/speaking/prompts/[promptId]`
- `/practice/speaking/sessions/[sessionId]`
- `/practice/speaking/history`
- `/practice/challenges`
- `/practice/events`
- `/practice/feedback`
- `/practice/progress`

### Settings

- `/settings`
- `/settings/profile`
- `/settings/learning`
- `/settings/appearance`
- `/settings/account`

Legacy V1 sidebar ideas such as `Today`, `This Week`, `Current Stage`,
`Upcoming`, `Recommended`, `Beginner`, `Grammar`, `New Draft`, `Record`,
`Feedback`, `Reflection`, `Mistakes`, `Goals`, and `Notifications` should stay
inline, state-based, or folded into the routes above unless later UX work
proves they need their own real workflow page.

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
- any section-level navigation that exists should reflect real navigation state, not decorative labels

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
5. writing workflow pages inside Practice
6. speaking workflow pages inside Practice
7. settings workflow pages
8. auth and onboarding expansion
9. cross-linking, continuity, and polish

## Phase 0: Subpage Architecture Foundation

Status:

- [ ] Not started

Goal:

Create the routing and shell rules that grow V1's simplified top-level navigation into a deeper but still intentional V2 route system.

Tasks:

- [ ] Define nested routing structure for selective route-backed workflows
- [ ] Define which concepts stay inline or URL-state based instead of becoming pages
- [ ] Define root section page role as overview or command view
- [ ] Define deep-linking rules for reopening exact workflow entries
- [ ] Define section-level URL and state persistence rules
- [ ] Define when section-level navigation is justified and when it should stay absent
- [ ] Define mobile navigation behavior for subpage-heavy sections

Mobile version:

- [ ] Define a shared V2 mobile subpage shell using bottom navigation, contextual back paths, and section switchers only where needed
- [ ] Define mobile return-path behavior between overview pages and deep workflow subpages

Done when:

- [ ] every internal route maps to a real workflow surface
- [ ] root pages and subpages have non-overlapping roles
- [ ] filters, actions, and lightweight sections are not promoted into routes without clear product need
- [ ] nested routing rules are consistent across sections
- [ ] mobile and desktop navigation behavior are both defined
- [ ] shared mobile subpage navigation rules are explicit enough for every later phase

Related docs:

- [Information Architecture](../../ux/information-architecture.md)
- [Navigation](../../ux/navigation.md)
- [Frontend Architecture](../../engineering/frontend-architecture.md)

## Phase 1: Dashboard Subpages

Status:

- [ ] Not started

Goal:

Turn Dashboard from one command-center page into a small set of focused follow-up workflow pages without fragmenting the daily home.

Tasks:

- [ ] Preserve `/dashboard` as the primary daily execution and command-center return point
- [ ] Build `/dashboard/review` as the deeper review-entry surface
- [ ] Build `/dashboard/insights` as a focused improvement and weak-signal view
- [ ] Build `/dashboard/activity` as session continuity and history entry
- [ ] Define whether weekly pacing stays inside `/dashboard` or later earns its own real workflow route
- [ ] Add deep links from overview cards into exact dashboard subpages

Mobile version:

- [ ] Define one-dominant-action mobile hierarchy across dashboard root, review, insights, and activity surfaces
- [ ] Define mobile ordering for review, insight, and activity continuity views

Done when:

- [ ] dashboard root works as a command view rather than duplicating every subpage
- [ ] each dashboard subpage answers a distinct daily decision
- [ ] weekly pacing and today orchestration are not duplicated into thin extra routes
- [ ] the learner can move from dashboard overview into focused follow-up views without friction
- [ ] dashboard subpages are more than filtered cards from one page
- [ ] each dashboard subpage remains readable and decisive on phone

Related docs:

- [Dashboard](../../ux/dashboard.md)
- [Navigation](../../ux/navigation.md)
- [Review System](../../system/review-system.md)
- [Progress Model](../../system/progress-model.md)

## Phase 2: Roadmap Subpages

Status:

- [ ] Not started

Goal:

Expand Roadmap into a deeper strategic workspace with real stage, skill, and milestone routes without turning every filter into a page.

Tasks:

- [ ] Preserve `/roadmap` as the strategic overview page
- [ ] Build `/roadmap/stages/[stageSlug]` for active stage execution and deeper stage continuity
- [ ] Build `/roadmap/skills/[skillSlug]` as the reusable skill-focused roadmap route
- [ ] Build `/roadmap/milestones` as progress landmark and checkpoint view
- [ ] Define whether current and upcoming work stay inside the roadmap root or move into stage detail surfaces
- [ ] Define direct routes from roadmap blocks into linked resources and practice tasks

Mobile version:

- [ ] Define stage-first mobile progression with compact skill pivots and milestone interpretation
- [ ] Define mobile transitions between roadmap detail, linked resources, and practice entries

Done when:

- [ ] roadmap supports both stage-first and skill-first navigation
- [ ] current and upcoming work are handled clearly without thin duplicate pages
- [ ] milestones have a dedicated interpretation surface
- [ ] roadmap subpages feel like workflow areas, not duplicate filters
- [ ] roadmap subpages preserve strategic clarity on phone without side-by-side dependence

Related docs:

- [Roadmap UX](../../ux/roadmap.md)
- [Navigation](../../ux/navigation.md)
- [Recommendation Logic](../../system/recommendation-logic.md)

## Phase 3: Resources Subpages

Status:

- [ ] Not started

Goal:

Turn Resources into a structured editorial library with deeper route-backed entry points while keeping filters lightweight.

Tasks:

- [ ] Preserve `/resources` as the overview and discovery start page
- [ ] Build `/resources/collections` as the editorial browsing surface
- [ ] Build `/resources/collections/[collectionSlug]` as the deeper collection surface
- [ ] Build `/resources/library/[resourceSlug]` as the route-backed resource detail surface
- [ ] Build `/resources/follow-up` as the continue/saved/revisit queue
- [ ] Define how level, skill, and recommendation filters stay as URL state instead of immediately becoming standalone pages
- [ ] Define how recommendation context, why-now logic, and follow-up actions appear inside each subpage
- [ ] Define routes from roadmap and dashboard into exact resource subpages or cards

Mobile version:

- [ ] Define filter sheet behavior, compact card density, and full-width mobile resource actions
- [ ] Define how recommendation reasons and follow-up actions remain visible above the fold on phone

Done when:

- [ ] resource browsing is organized by real user intent, not only one generic list
- [ ] recommendation context survives across deeper routes
- [ ] level and skill filters stay lightweight unless they prove they need their own distinct workflow pages
- [ ] resources subpages remain editorial and guided rather than database-like
- [ ] resource subpages stay trustworthy and easy to act on in mobile layouts

Related docs:

- [Resources UX](../../ux/resources.md)
- [Navigation](../../ux/navigation.md)
- [Recommendation Logic](../../system/recommendation-logic.md)

## Phase 4: Writing Workflow Pages

Status:

- [ ] Not started

Goal:

Expand Practice writing mode into a multi-page active workspace with clear task, draft, submission, and history continuity.

Tasks:

- [ ] Preserve `/practice` as the section entry page and `/practice/writing` as the writing overview
- [ ] Build `/practice/writing/tasks` as the task list and task-entry view
- [ ] Build `/practice/writing/tasks/[taskId]` as the focused task context surface
- [ ] Build `/practice/writing/drafts/[draftId]` as the active drafting surface
- [ ] Build `/practice/writing/submissions/[submissionId]` as the feedback and rewrite loop surface
- [ ] Build `/practice/writing/history` as the continuity and archive view
- [ ] Define how `New Draft` opens a draft route instead of becoming a permanent navigation page
- [ ] Define whether repeated mistake review stays inside history/submission surfaces or later earns its own true page
- [ ] Define direct reopening of exact drafts, feedback states, and history entries

Mobile version:

- [ ] Define task-first mobile writing flow with dominant draft continuation and stacked submission states
- [ ] Define compact mobile hierarchy between active drafting, submission feedback, and writing history

Done when:

- [ ] writing has a clear start-to-feedback workflow across routes
- [ ] draft continuation is route-backed and recoverable
- [ ] feedback and mistake review are reachable without route clutter
- [ ] writing history helps the learner continue, not only archive old work
- [ ] writing routes remain low-friction and readable on phone

Related docs:

- [Writing UX](../../ux/writing.md)
- [AI Writing Feedback](../../ai/ai-writing-feedback.md)
- [Progress Model](../../system/progress-model.md)

## Phase 5: Speaking Workflow Pages

Status:

- [ ] Not started

Goal:

Expand Practice speaking mode into a route-backed workspace with clear prompt, session, and history continuity without promoting every state into its own nav item.

Tasks:

- [ ] Preserve `/practice` as the section entry page and `/practice/speaking` as the speaking overview
- [ ] Build `/practice/speaking/prompts` as the session-entry view
- [ ] Build `/practice/speaking/prompts/[promptId]` as the focused prompt-launch surface
- [ ] Build `/practice/speaking/sessions/[sessionId]` as the active speaking session and follow-up surface
- [ ] Build `/practice/speaking/history` as the continuity and archive view
- [ ] Define how record, feedback, and reflection live inside session routes unless later UX work proves they need separate pages
- [ ] Define reopening rules for prompt, recording, transcript, feedback, and history continuity

Mobile version:

- [ ] Define prompt-first mobile speaking flow with a dominant record or continue action
- [ ] Define compact phone hierarchy between active session, reflection, and continuity history

Done when:

- [ ] speaking supports a repeatable route-backed session flow
- [ ] recording, feedback, and reflection are handled coherently without thin duplicate pages
- [ ] history supports confidence-building continuity across sessions
- [ ] speaking routes remain approachable and confidence-building on phone

Related docs:

- [Speaking UX](../../ux/speaking.md)
- [AI Speaking Feedback](../../ai/ai-speaking-feedback.md)
- [Progress Model](../../system/progress-model.md)

## Phase 6: Settings Workflow Pages

Status:

- [ ] Not started

Goal:

Turn Settings into a smaller set of clear control surfaces without route clutter.

Tasks:

- [ ] Build `/settings/profile`
- [ ] Build `/settings/learning`
- [ ] Build `/settings/appearance`
- [ ] Build `/settings/account`
- [ ] Preserve `/settings` as the overview and settings home
- [ ] Define where notifications live and whether they remain inline inside account or learning until they prove they need a dedicated page
- [ ] Define how appearance, study, and reminder preferences affect the rest of the system visibly

Mobile version:

- [ ] Define stacked mobile settings flows with touch-friendly grouped controls
- [ ] Define how profile, learning, appearance, and account pages prioritize high-frequency changes on phone

Done when:

- [ ] each settings subpage owns a clear configuration job
- [ ] goals, preferences, and notifications are not scattered across too many thin routes
- [ ] settings changes can be understood in terms of product impact
- [ ] settings remains calm and focused rather than becoming a feature dump
- [ ] settings stays easy to scan and edit on phone without long unfocused forms

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

Mobile version:

- [ ] Define phone-first auth and onboarding step rhythm with one clear action per screen
- [ ] Define compact mobile error, pending, and resume states for interrupted onboarding

Done when:

- [ ] auth has explicit pending and error states
- [ ] onboarding is step-based and resumable
- [ ] onboarding steps map directly to the required learner profile inputs
- [ ] the final onboarding handoff creates a meaningful first-dashboard state
- [ ] auth and onboarding remain calm and readable in mobile step-by-step flows

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

Mobile version:

- [ ] Polish bottom navigation, contextual section switching, and return-path continuity for deeper phone workflows
- [ ] Verify that exact deep links open usable mobile workflow states instead of desktop-biased layouts

Done when:

- [ ] moving across subpages feels continuous
- [ ] mobile and desktop both support deep workflows cleanly
- [ ] cross-links open exact relevant workflow entries
- [ ] V2 feels like a coherent deeper English OS, not a set of unrelated nested routes
- [ ] deep mobile workflows feel intentional rather than patched together

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
- verify that any section-level navigation is route-backed, justified, and smaller than the old V1 placeholder lists
- verify that mobile behavior is designed intentionally for every subpage
- verify that deeper routes create clearer workflows rather than duplicating the same layout with different filters

## Status

Future planning document, active.

## Related Docs

- [Roadmap Futures](./README.md)
- [V1 MVP Roadmap](../v1-mvp-roadmap.md)
- [Navigation](../../ux/navigation.md)
- [Information Architecture](../../ux/information-architecture.md)
