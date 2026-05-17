# AI Role In V1

## Purpose

This document defines exactly what AI should and should not do in the first version of English OS.

AI in V1 should make the product feel more personally aware without turning the system into a fragile AI wrapper.

## Core Principle

AI is not the product by itself.

AI is the intelligence layer on top of the learning system.

The product should still work as a roadmap, resource, progress, review, writing, and speaking system without relying on AI to invent the whole experience at runtime.

## V1 AI Role

In V1, AI should support:

- writing feedback
- speaking feedback
- recommendation explanation
- learner insight summaries
- lightweight personalization signals

AI should make the existing system feel smarter, clearer, and more personal.

## What AI Owns In V1

AI can own:

- feedback wording
- explanation quality
- summarization of learner behavior
- rewriting suggestions
- speaking transcript review
- recommendation rationale phrasing

## What AI Does Not Own In V1

AI should not own:

- roadmap templates
- roadmap state
- core recommendation candidate generation
- review triggers
- progress event capture
- database truth
- authentication or authorization

These should remain deterministic product/system logic.

## AI Use Cases For V1

### Writing Feedback

AI reviews a learner's writing attempt and returns structured feedback.

### Speaking Feedback

AI reviews a transcript or speaking session metadata and returns useful speaking feedback.

### Recommendation Explanation

AI can help explain why a recommendation is useful, but the base recommendation should come from system rules.

### Learner Insights

AI can summarize patterns such as:

- you practiced writing consistently this week
- speaking has been neglected recently
- this grammar pattern keeps appearing in feedback

## Required Guardrails

AI outputs should be:

- structured when stored
- explainable to the user
- scoped to the specific task
- based on known learner context
- safe to ignore if unavailable

The product should degrade gracefully if AI is temporarily unavailable.

## Server-Side Boundary

All AI calls must happen server-side.

AI provider keys should never be exposed to the browser.

Implementation should route AI behavior through:

```text
src/server/ai/
```

## V1 Success Criteria

AI in V1 is successful if:

- writing feedback feels useful
- speaking feedback lowers friction and builds confidence
- recommendations feel better explained
- learner insights feel personal but not overconfident
- the product still works when AI is not central

## Status

Active.

## Related Docs

- [Product Thesis](../product/thesis.md)
- [Recommendation Logic](../system/recommendation-logic.md)
- [Backend Architecture](../engineering/backend-architecture.md)
- [Future AI](./future-ai.md)
