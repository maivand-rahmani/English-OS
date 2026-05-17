# Information Architecture

## Purpose

This document defines the top-level structure of English OS.

It describes the major sections of the product, how they relate to one another, and what role each section plays in the overall learning system.

## UX Positioning

English OS should feel like:

- an operating system for English learning
- an intelligent study dashboard
- a personal learning planner
- a product with active practice zones

The interface should support all four without becoming cluttered or lesson-heavy.

## Product Shell Model

The product should use an application-shell structure:

- a global top bar for major product zones
- a local sidebar inside each major zone
- a primary content area for the active workflow

This supports the "control center" feeling and allows the product to scale without collapsing into a single crowded dashboard.

The shell must support both desktop browser and mobile web.

Desktop can use a visible top bar, vertical sidebar, and multi-panel content.

Mobile should adapt the same information architecture into focused views, compact navigation, and prioritized cards rather than forcing the desktop dashboard into a narrow screen.

## Top-Level Sections

English OS V1 should have these top-level sections:

1. Dashboard
The main control center and daily home.

2. Roadmap
The learner's structured path through English development.

3. Resources
The curated resource layer and discovery surface.

4. Writing
The writing practice workspace.

5. Speaking
The speaking practice workspace.

6. Settings
Profile, preferences, and system configuration.

## Why This Structure Exists

This structure is intentional:

- Dashboard gives daily clarity.
- Roadmap gives long-term direction.
- Resources give trusted external guidance.
- Writing and Speaking give active skill execution.
- Settings keep personalization and preferences controllable.

Together, these sections make the product feel like a system rather than a library.

## What Is Not Top-Level In V1

These areas should not be top-level sections in V1:

- Listening
- Reading
- Progress
- Review
- AI assistant

Reason:

- Listening and reading can be represented inside roadmap and resources first.
- Progress should be visible across the system, especially in dashboard and skill zones.
- Review should be embedded into daily learning rather than isolated as a separate mode.
- AI should support the system, not dominate the structure.

## Primary Product Flow

The core user flow should be:

1. User starts onboarding
2. System creates learner profile
3. System generates initial roadmap and recommendations
4. User lands on dashboard
5. Dashboard directs user into roadmap, resource, review, writing, or speaking action
6. System stores learning activity and updates visible progress

This flow should make the product feel immediately useful after setup.

## Hierarchy Of Importance

The UX should reflect this value hierarchy:

1. Clarity
2. Guidance
3. Curation
4. Progress visibility
5. Practice
6. Intelligence

This means the interface should prioritize "what should I do next?" before analytics depth or decorative feature layers.

## Page Hierarchy

### Unauthenticated Layer

- Start / entry screen
- onboarding flow

### Authenticated App Layer

- Dashboard
- Roadmap
- Resources
- Writing
- Speaking
- Settings

### Embedded Cross-Cutting Modules

- review surfaces
- progress surfaces
- recommendation cards
- recent activity
- learner insights

These modules should appear where they are most useful rather than being forced into separate product sections.

## IA Principles

1. Daily use should begin from dashboard.
2. Strategic planning should live in roadmap.
3. Discovery should live in resources.
4. Active language production should live in writing and speaking.
5. Shared system signals like progress and review should appear across multiple sections.

## Status

Active.

## Related Docs

- [Navigation](./navigation.md)
- [Dashboard](./dashboard.md)
- [Roadmap](./roadmap.md)
- [Resources](./resources.md)
