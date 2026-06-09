# Mobile V1 Design

## Purpose

This document defines the phone-first mobile web design direction for the current V1 English OS product.

It is the source of truth for how the existing product system should translate from desktop into intentional mobile workflows.

This document is about design structure, hierarchy, and interaction expectations. It does not require immediate code implementation by itself.

Current implementation note:

The current codebase now includes a mobile V1 pass for the app shell plus the dashboard, roadmap, resources, writing overview, speaking overview, and settings overview. The product still needs deeper writing/speaking session flows, review logic, and AI-light work, but the phone-first shell and section hierarchy are no longer just design intent.

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

Fixed decisions for this V1 pass:

- phone-first mobile web is the default target for all surfaces below `lg`
- `lg` and above keep the desktop shell
- global navigation on phone uses a fixed bottom nav
- phone navigation stays limited to the five primary product sections
- settings is exposed from the header utility area rather than the bottom nav
- mobile search is intentionally hidden for now instead of becoming a half-finished flow
- mobile filter and sheet behavior uses `@base-ui/react`
- this pass changes UI hierarchy, layout, and mobile interaction patterns without changing product logic, Prisma, local-state hooks, or recommendation logic

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

- bottom navigation for top-level sections only
- settings from a header utility button

The primary top-level sections remain:

- Dashboard
- Roadmap
- Resources
- Writing
- Speaking

Settings should remain available as a route from the header utility area.

### Local section navigation

V1 should not add nested mobile navigation for unfinished internal section pages.

If a page needs internal organization, it should use inline sections, actions, filters, modals, or lightweight tabs inside the main experience.

### Header behavior

The mobile header should stay short and utility-light.

It should prioritize:

- current section identity
- lightweight utilities only

It should avoid:

- long descriptive intro copy
- duplicated hierarchy labels
- desktop-style utility clusters competing with the main task
- wide search controls without a full mobile search flow

### Safe-area and shell behavior

Phone layouts must assume:

- safe-area-aware bottom spacing for fixed navigation
- extra bottom padding for CTA blocks so actions do not slide under the bottom nav
- shell tokens that continue to respect theme, text size, density, and motion settings
- separate mobile and desktop shell composition instead of one desktop layout squeezed responsively

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

The roadmap should become a vertical connected path on mobile.

Progression should read top-to-bottom and continue downward for as many steps
as the active roadmap contains.

Stage zones should remain visible as grouped regions in the same roadmap flow.

Step nodes should stay tap-friendly and show compact state indicators, current
step context, primary skill, and resource count.

Step details should open in a near-full-screen modal overlay, not a side drawer
or a new route.

### Rules

- no dependency on a wide right panel for key understanding
- block states must remain visible on the node
- primary status actions should be easy to reach from the step modal
- linked resources should feel like supporting material inside the step modal
- roadmap should remain strategic, not collapse into a plain checklist
- the mobile roadmap must scale beyond the MVP step count without redesigning
  the layout
- hover previews must never be required for understanding on touch devices

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

In the current V1 pass this means the first visible layer should hold:

- title
- why now or recommendation reason
- type or primary skill signal
- time
- one dominant CTA

Secondary metadata can collapse lower in the card.

### Rules

- primary CTA should be full-width or clearly dominant
- secondary CTA should be visually reduced
- recommendation reason should remain visible above the fold
- filtering should feel lightweight, not like a database interface
- source context and follow-up action should still be preserved lower in the card, not removed

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

Recommended order for the current overview pass:

1. next task or current draft
2. draft stack
3. feedback or support blocks
4. roadmap context

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

Recommended order for the current overview pass:

1. active prompt
2. dominant record or continue action
3. continuity and recent history
4. reflection and support

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

Recommended order for the current overview pass:

1. appearance and preference controls
2. current applied appearance state
3. learner setup
4. notifications and account surfaces

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

## Mobile Continuity Rules

Short phone sessions should assume:

- the learner may leave and return mid-flow without warning
- local drafts, progress, and events must survive interruption
- resume states should favor continuation over rediscovery
- mobile entry surfaces should show the next useful action before secondary history or analytics

These rules are partly implemented today through the local-first browser state layer and partly define the contract for later writing/speaking session work.

## QA Baseline

The minimum manual mobile QA widths for this V1 pass are:

- `390px`
- `430px`
- `768px`
- `1024px`

The current implementation also adds targeted RTL coverage for:

- mobile versus desktop app shell rendering
- bottom navigation visibility
- resources mobile filter sheet open/close behavior

## Status

Active.

## Related Docs

- [Information Architecture](./information-architecture.md)
- [Navigation](./navigation.md)
- [V1 Navigation Simplification Rule](./v1-navigation-simplification-rule.md)
- [Dashboard](./dashboard.md)
- [Roadmap](./roadmap.md)
- [Resources](./resources.md)
- [Writing](./writing.md)
- [Speaking](./speaking.md)
- [Settings](./settings.md)
