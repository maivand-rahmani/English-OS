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

## Example Roadmap Shape

The exact names can evolve, but the general structure should look like:

- stage-based progression
- blocks inside each stage
- each block tied to one or more skills
- each block supported by curated resources and practice tasks

This is better than a purely linear list or a purely abstract skill graph for V1.

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
- needs review
- skipped for now

These states should support both learner clarity and future system logic.

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

## Roadmap Principles

1. The roadmap should make learning direction visible.
2. The roadmap should explain sequence, not only content.
3. The roadmap should connect planning to action.
4. The roadmap should feel personal even if V1 uses templates under the hood.

## What The Roadmap Should Not Become

The roadmap should not become:

- a lesson playlist
- a static progress bar with no real guidance
- a giant tree with too much complexity for V1

It should remain structured, interpretable, and actionable.

## Status

Active.

## Related Docs

- [Information Architecture](./information-architecture.md)
- [Dashboard](./dashboard.md)
- [Resources](./resources.md)
- [Recommendation Logic](../system/recommendation-logic.md)
