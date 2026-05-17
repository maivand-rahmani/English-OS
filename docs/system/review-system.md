# Review System

## Purpose

This document defines how repetition and review work in English OS.

Review is a core part of the product thesis because the learner should not only move forward. The system should also help them return to what is fading, weak, or avoided.

## Review Philosophy

Review should not be a separate isolated study mode that the learner has to remember manually.

It should be built into the system as a cross-cutting layer that:

- surfaces weak or fading material
- protects against forgetting
- turns activity into continuity

## Unified Review Queue

V1 should use one unified review queue even if the underlying sources are different.

This queue can include:

- resource review
- roadmap block review
- writing mistake review
- speaking pattern review

This makes review feel like part of the operating system rather than a separate product.

## Review Sources

### Resource Review

Triggered when:

- a resource was completed but marked difficult
- a resource was useful but should be revisited
- enough time has passed after an important resource

### Roadmap Block Review

Triggered when:

- a block was completed but needs reinforcement
- related activity signals suggest weak retention
- the learner skipped too much around a block

### Writing Mistake Review

Triggered when:

- the same mistake pattern appears repeatedly
- the learner needs to revisit a recurring writing weakness

### Speaking Pattern Review

Triggered when:

- the learner repeatedly struggles with a specific speaking pattern
- speaking activity shows recurring weakness or avoidance

## Review Item Structure

Each review item should eventually support fields such as:

- source_type
- source_id
- learner_id
- due_at
- priority
- reason
- status
- completed_at

## Priority Logic

V1 priority can be rule-based and should consider:

- how overdue the item is
- how important the source skill is right now
- how often the learner has avoided the area
- whether the weakness is recurring
- whether the item is tied to the learner's active roadmap stage

## User Actions In Review

The learner should be able to:

- complete review
- defer or snooze
- mark still difficult
- mark now clear

These actions should feed back into both progress and recommendation logic.

## Review Placement In UX

Review should appear primarily in:

- dashboard
- roadmap context when relevant
- writing or speaking contexts when relevant

It should not require the learner to navigate to a special "memory app" mode in V1.

## Review Principles

1. Review should feel timely, not overwhelming.
2. Review should be connected to real learning history.
3. Review should reinforce trust in the system's memory.
4. Review should support momentum rather than interrupt it harshly.

## V1 Review Strategy

V1 should start simple:

- generate review items from clear triggers
- prioritize with rules
- display in one queue
- store learner responses

This is enough to create strong product value before more advanced retention intelligence arrives.

## Relationship To Other Systems

- progress creates review signals
- review outcomes update progress states
- recommendations decide whether review or forward motion comes first
- analytics measures review completion and retention behavior

## Status

Active.

## Related Docs

- [Progress Model](./progress-model.md)
- [Recommendation Logic](./recommendation-logic.md)
- [Dashboard](../ux/dashboard.md)
- [Roadmap UX](../ux/roadmap.md)
