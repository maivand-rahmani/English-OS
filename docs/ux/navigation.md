# Navigation

## Purpose

This document defines the navigation model of English OS.

It describes the active V1 navigation model, route behavior, and the line
between real product depth and future V2 navigation planning.

## Navigation Principles

1. Navigation should reflect product logic, not just feature inventory.
2. The user should always know where they are and what they can do next.
3. Movement between planning, doing, and reviewing should be friction-light.
4. Navigation should feel calm and stable, not crowded.
5. V1 navigation should reflect implemented product depth, not future feature inventory.

## Global Top Bar

The global top bar should contain the main product zones:

- Dashboard
- Roadmap
- Resources
- Practice

Settings should live as a separate header utility button rather than inside the
main navigation pill.

The top bar represents major modes of using English OS.

The shared shell should not render a second page-specific eyebrow, title, or
subtitle block under this navigation. The active state in the global shell is
enough to show where the learner is.

## V1 Simplification Rule

English OS V1 uses top-level navigation only.

Section sidebars are not active in V1.

Sidebar items from earlier planning remain future V2 concepts only and must not
be treated as current route requirements.

Do not create fake subpages for actions, filters, states, or lightweight
sections.

## Why These Top-Level Items Exist

- Dashboard is the home and command center.
- Roadmap is the long-term path.
- Resources is the curated discovery layer.
- Practice is the V1 home for active writing and speaking work.
- Settings holds user-controlled configuration and profile management.

## Page-Level Structure In V1

Page-specific concepts should stay inside each main page as inline sections,
tabs, filters, modal states, or actions.

The shell should not prepend a generic page header before those experiences.

Examples:

- Dashboard keeps `Today`, `This Week`, `Review`, `Weak Areas`, and `Recent Activity` as sections or cards inside the page.
- Roadmap keeps `Current Stage` and `Upcoming` inside the roadmap experience, while `Grammar`, `Vocabulary`, `Reading`, and `Listening` remain filters, layers, or tags.
- Resources keeps `Recommended`, `Collections`, levels, and skills as integrated discovery states inside one page.
- Practice keeps `Writing` and `Speaking` as modes inside one studio-like page surface and keeps draft, recording, feedback, reflection, and history concepts inside the mode experience instead of separate V1 routes.
- Settings keeps profile, goals, preferences, notifications, and account controls inside one simple settings page.

## Route Behavior

The product should support:

- fast switching between major zones
- clear deep-linking to real implemented states when useful
- preserved context when moving inside a workspace

Examples:

- a dashboard card can open the current roadmap block
- a roadmap block can open a recommended resource
- a dashboard practice card can open `Practice` in writing or speaking mode

Roadmap step clicks should open an in-place centered modal first. They should
not immediately navigate away from the roadmap. Links inside that modal may then
open a resource detail or external resource when the learner chooses deeper
support.

V1 should not surface unfinished or placeholder internal routes in the UI.

## Cross-Linking Rules

The best navigation moments in English OS should come from context-aware
cross-linking:

- from dashboard to next action
- from roadmap to recommended resource
- from resource completion to reflection or review
- from Practice writing mode to the next relevant roadmap or review step
- from Practice speaking mode to transcript or next prompt work when those flows are real

The product should feel connected, not segmented.

## Default Landing Behavior

After onboarding, authenticated users should land on Dashboard by default.

Dashboard should function as the return point for daily use, while other
sections support deeper work.

## Global Utility Elements

The application shell may later include shared utility elements such as:

- profile access
- notifications
- quick resume action
- search

These should remain secondary to the main structural navigation in V1.

## Status

Active.

## Related Docs

- [V1 Navigation Simplification Rule](./v1-navigation-simplification-rule.md)
- [Information Architecture](./information-architecture.md)
- [Practice](./practice.md)
- [Dashboard](./dashboard.md)
- [Roadmap](./roadmap.md)
- [Writing](./writing.md)
- [Speaking](./speaking.md)
- [Settings](./settings.md)
