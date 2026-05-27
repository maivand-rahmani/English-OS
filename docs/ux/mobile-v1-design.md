# Mobile V1 Design

## Purpose

This document defines the phone-first mobile web design direction for the current V1 English OS product.

It is the source of truth for how the existing product system should translate from desktop into intentional mobile workflows.

This document is about design structure, hierarchy, and interaction expectations. It does not require immediate code implementation by itself.

## Scope

The current-state mobile design scope includes:

- app shell
- dashboard
- roadmap
- resources
- writing
- speaking
- settings

These surfaces are included because they already exist in the current product state, even if some of their larger roadmap phases are still incomplete.

Tablet can be adapted later, but this document treats phone-sized mobile web as the primary target.

## Mobile Principles

English OS on mobile should feel like:

- the same product system
- a calmer sequential workflow
- a focused pocket version of the desktop product
- a serious personal tool, not a squeezed dashboard

Core rules:

- one primary action should dominate each screen
- copy should be compact and directive
- cards should stack by priority instead of preserving desktop grids
- typography must remain readable in short study sessions
- touch targets must stay comfortable
- the same theme, typography, radius, surface, and motion tokens should be preserved from desktop
- mobile should transform desktop structure intentionally, not compress it blindly

## Mobile Shell

### Global navigation

Phone navigation should use:

- bottom navigation for top-level sections
- top horizontal chips or a segmented row for local section lanes

The top-level sections remain:

- Dashboard
- Roadmap
- Resources
- Writing
- Speaking
- Settings

### Local section structure

Local section lanes should appear near the top of the active screen as:

- horizontal chips
- a segmented control row
- or another compact, tap-friendly variant

They should not behave like a permanently visible desktop rail on phone.

### Header behavior

The mobile header should stay short and utility-light.

It should prioritize:

- current section identity
- one local context cue when needed
- lightweight utilities only

It should avoid:

- long descriptive intro copy
- duplicated hierarchy labels
- desktop-style utility clusters competing with the main task

### Density behavior

Phone layouts should use:

- single-column stacking
- fewer simultaneous panels
- stronger content priority
- calmer spacing rhythm

They should not attempt to preserve the full desktop canvas composition on a narrow screen.

## Dashboard Mobile

### Job

The dashboard must still answer:

- what should I do now
- what matters most today
- what should I review
- where am I making progress

### Layout direction

The primary hero should become a compact next-action block.

It should contain:

- one dominant task
- short summary copy
- focus and time context
- direct action buttons

Desktop right-column concepts should stack below the primary block instead of competing beside it.

### Recommended content order

1. Today plan
2. Progress snapshot
3. Best next resource
4. Review preview
5. Writing and speaking actions
6. Recent activity

### Rules

- progress snapshot must remain visible, not removed
- recent activity should stay supportive, not equal-weight with the next action
- the page should still feel edited, not like a long analytics wall
- the next action should be obvious within one or two scrolls

## Roadmap Mobile

### Job

Roadmap on phone should make direction visible without requiring desktop-style side-by-side reading.

It should answer:

- where am I
- what block comes next
- what stage matters now

### Layout direction

The active stage and next block should appear first.

Stage cards should stack vertically.

Progression should read top-to-bottom.

Important block state indicators should stay visible as compact chips or tags.

### Rules

- no dependency on a wide right panel for key understanding
- block states and primary actions must remain visible without opening side panels
- linked resources should feel like a direct continuation of the current block
- roadmap should remain strategic, not collapse into a plain checklist

## Resources Mobile

### Job

Resources on phone should keep editorial trust while reducing visual density.

It should answer:

- what is worth using now
- why this resource is here
- what should I do next

### Layout direction

The featured or current resource should appear first.

Filters should move into a sheet, modal, or another compact mobile filter surface.

Resource cards should show only the most important editorial metadata above the fold.

### Card priority

Each mobile resource card should prioritize:

- title
- why it is recommended
- type or skill fit
- time expectation
- primary action

Secondary metadata can collapse lower in the card.

### Rules

- primary CTA should be full-width or clearly dominant
- secondary CTA should be visually reduced
- recommendation reason should remain visible above the fold
- filtering should feel lightweight, not like a database interface

## Writing Mobile

### Job

Writing on phone should lower the barrier to continuing work.

It should make it easy to:

- start the next task
- reopen the current draft
- understand what improvement matters next

### Layout direction

The next task or current draft should appear first.

Draft stack should be vertical.

Feedback and mistake guidance should appear below the active work area.

Roadmap context should remain secondary.

### Rules

- continuation should beat exploration
- active writing should dominate over archive/history
- revision guidance should stay compact and actionable
- the page should feel like a workspace, not a card catalog

## Speaking Mobile

### Job

Speaking on phone should make active practice feel approachable and easy to resume.

It should make it easy to:

- open the active prompt
- start or continue a recording flow
- see recent speaking continuity

### Layout direction

The active prompt should appear first.

Record or continue should be the dominant action.

Recent speaking continuity should stack below the active session area.

Reflection should remain supportive, not equal-weight with the main action.

### Rules

- the phone experience should reduce friction and pressure
- post-session information should not bury the next speaking action
- continuity should build confidence rather than create noise

## Settings Mobile

### Job

Settings on phone should support frequent changes calmly.

It should make it easy to:

- adjust appearance
- review profile and goals
- change preferences
- access notifications and account controls

### Layout direction

High-frequency preference groups should appear first.

Controls should stack in grouped sections.

Profile, goals, preferences, notifications, and account should remain visually separated into calm blocks.

### Rules

- grouped controls should stay touch-friendly
- long catch-all forms should be avoided
- daily appearance and preference changes should feel faster than low-frequency account actions
- settings should never feel like a second dashboard

## Surface Acceptance Checklist

Each mobile surface should answer yes to these:

- Is the next action obvious?
- Are touch targets comfortable?
- Is the copy shorter than the desktop equivalent where possible?
- Does the hierarchy survive narrow width?
- Does the screen feel like the same system as desktop?
- Has the desktop layout been intentionally transformed rather than merely squeezed?

## Status

Active.

## Related Docs

- [Information Architecture](./information-architecture.md)
- [Navigation](./navigation.md)
- [Dashboard](./dashboard.md)
- [Roadmap](./roadmap.md)
- [Resources](./resources.md)
- [Writing](./writing.md)
- [Speaking](./speaking.md)
- [Settings](./settings.md)
