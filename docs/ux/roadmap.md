# Roadmap UX

## Purpose

This document defines how the roadmap is presented and used inside English OS.

The roadmap is the strategic planning layer of the product. It turns scattered studying into an ordered path.

## Role Of The Roadmap

The roadmap should answer:

- where am I in my English learning path
- what comes next
- why am I doing this now
- what larger stage am I working through

It should feel like a structured journey, not a loose resource list.

## Roadmap Model

V1 should use a staged roadmap with skill blocks inside each stage.

This gives the product:

- the clarity of a guided path
- the flexibility of multi-skill learning
- a better foundation for future personalization

The roadmap presentation should use a scalable connected graph, not a fixed
poster-style map. The graph must be data-driven and able to grow from a small
MVP roadmap to dozens or hundreds of steps without manual coordinate tuning.

The current interaction model is:

- one continuous vertical learning path
- stage zones generated from roadmap data
- step nodes repeated in a readable flow
- compact integrated roadmap status at the top of the canvas
- large centered step modal for deep detail and state control

This keeps the roadmap as the primary object while allowing it to scale
downward as more steps are added.

## Example Roadmap Shape

The exact names can evolve, but the general structure should look like:

- stage-based progression
- blocks inside each stage
- each block tied to one or more skills
- each block supported by curated resources and practice tasks

This is better than a static list, a resource catalog, or a fixed visual map
that only works for a small number of steps.

The roadmap may read as a vertical graph in V1, but it should not collapse into
a plain checklist. The visible path, stage zones, step states, and modal
workspace are what make it a roadmap.

## What A Roadmap Block Should Represent

A block should be a meaningful learning unit, not just a link.

Each block should include:

- title
- short purpose
- target skills or subskills
- recommended resources
- related writing or speaking tasks when relevant
- completion state

## Block States

V1 should support clear visible states such as:

- not started
- in progress
- completed
- difficult
- needs review
- skipped for now

These states should support both learner clarity and future system logic.

State changes must update the node, path/progress indicators, active/current
step recommendation, and modal badge immediately from local progress state.

## Step Node UX

Every roadmap step should be understandable without opening the modal.

Each visible step node should communicate:

- step position
- short title
- stage context
- current state
- primary skill
- attached resource count
- whether this is the current/next action

The UI should not rely on color alone. Status needs icons, labels, rings,
opacity, and copy where appropriate.

## Step Detail Modal

Clicking or tapping a roadmap step must open a large centered modal overlay.

The modal should:

- render through a body-level portal so it is not trapped by page or shell
  layout layers
- appear above the full app shell
- keep the roadmap visible behind a calm backdrop
- support Escape close, visible close button, focus management, and return
  focus to the triggering step
- contain step purpose, task checklist, connected resources, visible status
  controls, and next-step guidance

Do not use a right-side drawer for Roadmap step details.

Status controls must be visible in the modal, not hidden in a menu.

## Adaptation Behavior

V1 does not need deep AI-generated roadmap rebuilding, but the roadmap should still support lightweight adaptation signals:

- too easy
- too hard
- not useful
- skip for now

These signals can later inform personalization logic without changing the UX model.

## Roadmap And Daily Use

Roadmap is not the default landing page, but it should remain central.

The relationship should be:

- Dashboard gives daily action
- Roadmap gives strategic structure
- Resources support roadmap blocks
- Writing and Speaking can be linked from relevant blocks

Resources remain supporting material inside roadmap steps. The Roadmap page
should not become the full resource library.

## Roadmap Principles

1. The roadmap should make learning direction visible.
2. The roadmap should explain sequence, not only content.
3. The roadmap should connect planning to action.
4. The roadmap should feel personal even if V1 uses templates under the hood.
5. The roadmap UI should scale with the number of steps rather than assuming a
   small fixed template.
6. The roadmap page itself should be the roadmap, not a page with a hero above a
   roadmap section.

## What The Roadmap Should Not Become

The roadmap should not become:

- a lesson playlist
- a static progress bar with no real guidance
- a giant tree with too much complexity for V1
- a fixed coordinate map that breaks when the number of steps grows
- a resource catalog with roadmap labels attached

It should remain structured, interpretable, and actionable.

## Status

Active.

## Related Docs

- [Information Architecture](./information-architecture.md)
- [Dashboard](./dashboard.md)
- [Resources](./resources.md)
- [Recommendation Logic](../system/recommendation-logic.md)
