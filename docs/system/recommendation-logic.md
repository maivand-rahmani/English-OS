# Recommendation Logic

## Purpose

This document defines how English OS chooses what the learner should do next.

Recommendation logic is one of the most important parts of the product because it turns stored learner context into practical guidance.

## Recommendation Philosophy

English OS should not merely show content. It should decide what is most useful now.

In V1, this should be done through transparent and strong rule-based logic, not black-box magic.

The system should feel:

- helpful
- timely
- explainable
- personally aware

## Main Recommendation Outputs

V1 should generate these key outputs:

- today's main roadmap action
- a best next resource
- review priorities
- a writing or speaking output action

These outputs should power the dashboard and related surfaces.

## Core Inputs

Recommendation logic should use inputs such as:

- learner level
- learner goals
- available study time
- active roadmap stage
- learner block states
- resource history
- review queue state
- weak or neglected skill areas
- recent writing activity
- recent speaking activity
- skip, difficulty, and usefulness signals

## V1 Recommendation Strategy

V1 should use a candidate-selection and ranking approach:

1. identify eligible next actions
2. filter out irrelevant or recently exhausted options
3. rank based on simple product rules
4. return a concise actionable set

This is more controlled and reliable than trying to synthesize recommendations from scratch.

## Candidate Types

The system should consider candidate actions from:

- roadmap blocks
- resources linked to active roadmap blocks
- due review items
- writing tasks
- speaking prompts

## High-Level Priority Rules

The recommendation layer should generally prioritize:

1. urgent review when something important is overdue
2. the next meaningful roadmap action
3. the best supporting resource for that action
4. one active output task

This structure matches the intended daily plan model.

## Daily Plan Logic

The dashboard's today plan should usually contain:

- one main roadmap action
- one review item or review cluster
- one output task, usually writing or speaking

This keeps the system focused and sustainable.

## Best Next Resource Logic

The best next resource should usually be selected from:

- the learner's current roadmap block
- a nearby active block
- a review-related support resource when needed

It should not usually be a random high-rated resource from the entire catalog.

## Recommendation Constraints

The system should avoid recommending:

- content that is too advanced for the learner
- repeated actions with no visible reason
- too many output tasks when the learner is already overloaded
- actions disconnected from the current roadmap context

## Adaptation Signals

The system should listen to these signals for future changes:

- too easy
- too hard
- not useful
- skipped
- neglected
- repeated mistakes

In V1, these may not fully rebuild the roadmap, but they should influence recommendation quality.

## Explainability

Recommendations should be explainable in product language.

Examples:

- recommended because this supports your current roadmap stage
- recommended because you marked the last related item difficult
- recommended because speaking has been neglected this week

This helps build trust.

## Relationship To AI

In V1:

- rule-based logic should own recommendation generation
- AI may later improve phrasing, explanation, and refinement

AI should not be the only mechanism deciding what the learner should do.

## Future Expansion

Later versions may use more advanced ranking based on:

- retention behavior
- outcome quality
- writing mistake trends
- speaking confidence trends
- longer-term learner pacing

But the V1 model should remain simple, legible, and stable.

## Status

Active.

## Related Docs

- [Roadmap UX](../ux/roadmap.md)
- [Resources UX](../ux/resources.md)
- [Dashboard](../ux/dashboard.md)
- [AI Recommendations](../ai/ai-recommendations.md)
