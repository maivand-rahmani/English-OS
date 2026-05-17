# Progress Model

## Purpose

This document defines how progress is tracked and interpreted in English OS.

The goal is to avoid shallow percent-complete tracking and instead build a progress model that reflects learning behavior, momentum, weakness, and retention.

## Progress Philosophy

English OS should not treat progress as "how much content was clicked."

It should treat progress as a hybrid of:

- activity
- self-reflection
- inferred learning state

This makes progress more truthful and more useful for recommendations and review.

## Three Signal Layers

### 1. Activity Signals

These capture what the learner actually did.

Examples:

- started a resource
- completed a resource
- opened a roadmap block
- submitted writing
- recorded speaking
- completed review

Activity signals are the system's most objective V1 inputs.

### 2. Reflection Signals

These capture the learner's own experience of the work.

Examples:

- easy
- hard
- useful
- confusing
- needs review
- skip for now

These signals are lightweight but important because learning quality cannot be inferred from activity alone.

### 3. Inference Signals

These are system-generated interpretations based on repeated patterns.

Examples:

- improving writing consistency
- neglecting speaking practice
- repeating the same weakness
- progressing through roadmap steadily
- showing low retention on certain blocks

Inference signals are what allow English OS to feel intelligent without needing deep AI in V1.

## Progress Surfaces

Progress should be visible across several levels:

### Skill Level

How the learner is doing in grammar, vocabulary, reading, listening, writing, and speaking.

### Subskill Level

How the learner is doing in more specific areas when enough evidence exists.

### Roadmap Block Level

How the learner is moving through the structured path.

### Behavior Level

How consistently the learner studies, reviews, and practices output.

## Core Progress Dimensions

The system should reason about progress through dimensions such as:

- completion
- consistency
- confidence
- difficulty
- retention
- avoidance

This is stronger than using a single score.

## Visible Learner States

V1 should use understandable visible states instead of opaque scoring systems.

Examples:

- not started
- active
- improving
- completed
- shaky
- neglected
- needs review

These states can later map to more complex internal calculations.

## Progress By Product Area

### Roadmap Progress

Driven mainly by:

- block state changes
- completion of related resources
- completion of linked tasks

### Resource Progress

Driven by:

- resource starts
- resource completions
- difficulty flags
- review flags

### Writing Progress

Driven by:

- submission frequency
- task completion
- feedback recurrence patterns
- rewrite behavior

### Speaking Progress

Driven by:

- session frequency
- prompt completion
- reflection
- recurring pattern signals

## What Progress Should Not Mean

Progress should not automatically mean mastery.

Examples:

- completing a resource does not guarantee understanding
- finishing a block does not eliminate the need for review
- frequent study does not always mean balanced study

This is why progress and review must remain linked.

## V1 Progress Strategy

V1 should be rule-based and evidence-weighted.

That means:

- raw events matter
- reflection matters
- repeated patterns matter
- visible states should be simple
- internal heuristics can grow later

## Relationship To Dashboard And Recommendations

The progress model should feed:

- dashboard insights
- review queue generation
- next-step recommendations
- weak-area surfaces
- consistency summaries

## Status

Active.

## Related Docs

- [Data Model](./data-model.md)
- [Review System](./review-system.md)
- [Analytics](./analytics.md)
- [Dashboard](../ux/dashboard.md)
