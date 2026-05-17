# Navigation

## Purpose

This document defines the navigation model of English OS.

It describes the top bar, section sidebars, and route behavior that make the product feel like a structured operating system rather than a collection of disconnected screens.

## Navigation Principles

1. Navigation should reflect product logic, not just feature inventory.
2. The user should always know where they are and what they can do next.
3. Movement between planning, doing, and reviewing should be friction-light.
4. Navigation should feel calm and stable, not crowded.

## Global Top Bar

The global top bar should contain the main product zones:

- Dashboard
- Roadmap
- Resources
- Writing
- Speaking
- Settings

The top bar represents major modes of using English OS.

## Why These Top-Level Items Exist

- Dashboard is the home and command center.
- Roadmap is the long-term path.
- Resources is the curated discovery layer.
- Writing and Speaking are active practice workspaces.
- Settings holds user-controlled configuration and profile management.

## Section Sidebars

Each top-level section should have its own local sidebar.

This sidebar should not duplicate the top bar. It should expose the internal structure of the active section.

### Dashboard Sidebar

- Today
- This Week
- Review
- Weak Areas
- Recent Activity

### Roadmap Sidebar

- Current Stage
- Upcoming
- Grammar
- Vocabulary
- Reading
- Listening
- Milestones

### Resources Sidebar

- Recommended
- Collections
- Beginner
- Intermediate
- Grammar
- Vocabulary
- Listening
- Reading
- Speaking
- Writing

### Writing Sidebar

- Tasks
- New Draft
- Feedback
- Mistakes
- History

### Speaking Sidebar

- Prompts
- Record
- Feedback
- Reflection
- History

### Settings Sidebar

- Profile
- Goals
- Preferences
- Notifications
- Account

## Route Behavior

The product should support:

- fast switching between major zones
- clear deep-linking to important subsections
- preserved context when moving inside a workspace

Examples:

- a dashboard card can open the current roadmap block
- a roadmap block can open a recommended resource
- a writing reminder on the dashboard can open the exact task or latest draft state

## Cross-Linking Rules

The best navigation moments in English OS should come from context-aware cross-linking:

- from dashboard to next action
- from roadmap to recommended resource
- from resource completion to reflection or review
- from writing feedback to mistake history
- from speaking session to transcript and next prompt

The product should feel connected, not segmented.

## Default Landing Behavior

After onboarding, authenticated users should land on Dashboard by default.

Dashboard should function as the return point for daily use, while other sections support deeper work.

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

- [Information Architecture](./information-architecture.md)
- [Dashboard](./dashboard.md)
- [Roadmap](./roadmap.md)
- [Settings](./settings.md)
