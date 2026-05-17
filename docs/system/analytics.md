# Analytics

## Purpose

This document defines what learner signals and product metrics English OS should capture.

Analytics in English OS should serve two jobs:

- help the product understand the learner
- help the team understand the product

## Analytics Philosophy

Analytics should not exist only for growth dashboards.

In English OS, analytics is part of the product intelligence layer because it supports:

- progress visibility
- weak-area detection
- consistency measurement
- recommendation quality
- future personalization

## Two Analytics Layers

### 1. Learner Analytics

These are signals used for the learner-facing system.

Examples:

- resource completion history
- review completion behavior
- roadmap movement
- study consistency
- writing frequency
- speaking frequency
- difficulty and review signals

### 2. Product Analytics

These are signals used by the team to improve the product.

Examples:

- onboarding completion rate
- dashboard engagement
- roadmap usage
- resource click-through and completion behavior
- writing workspace usage
- speaking workspace usage
- return frequency

## Core Event Categories

V1 should capture events across these categories:

### Profile Events

- onboarding_started
- onboarding_completed
- profile_updated

### Roadmap Events

- roadmap_viewed
- block_opened
- block_started
- block_completed
- block_skipped

### Resource Events

- resource_viewed
- resource_started
- resource_completed
- resource_marked_useful
- resource_marked_difficult
- resource_marked_for_review

### Review Events

- review_queue_viewed
- review_item_completed
- review_item_deferred
- review_item_still_difficult

### Writing Events

- writing_task_opened
- writing_submitted
- writing_feedback_viewed
- writing_rewritten

### Speaking Events

- speaking_prompt_opened
- speaking_recorded
- speaking_feedback_viewed
- speaking_reflection_completed

### Dashboard Events

- dashboard_viewed
- today_plan_action_started
- best_next_resource_opened

## Learner-Facing Metrics

The system should be able to derive metrics such as:

- weekly activity count
- study consistency
- output practice frequency
- review completion rate
- active skill balance
- neglected skill areas
- roadmap progress velocity

These support the learner-facing dashboard and insight system.

## Product-Facing Metrics

The team should be able to monitor:

- activation after onboarding
- first-value completion
- repeat engagement
- resource trust signals
- writing and speaking adoption
- review adoption

## Analytics Design Principles

1. Capture raw events first.
2. Derive summaries from raw events rather than storing only aggregates.
3. Keep learner analytics and product analytics conceptually distinct.
4. Instrument the product around core value, not vanity behavior.

## Status

Active.

## Related Docs

- [Progress Model](./progress-model.md)
- [Recommendation Logic](./recommendation-logic.md)
- [Backend Architecture](../engineering/backend-architecture.md)
- [Dashboard](../ux/dashboard.md)
