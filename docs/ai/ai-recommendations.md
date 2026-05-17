# AI Recommendations

## Purpose

This document defines how AI can support recommendation quality without becoming the core recommendation engine in V1.

## Recommendation Boundary

V1 recommendation generation should be rule-based.

The system should choose candidates using:

- learner level
- learner goals
- active roadmap stage
- block states
- resource history
- review queue state
- writing and speaking activity
- difficulty and usefulness signals

AI can support the recommendation experience, but it should not be the only mechanism deciding what the learner should do next.

## AI's Role In Recommendations

AI can help with:

- explaining why a recommendation matters
- translating system signals into human-friendly language
- summarizing tradeoffs between next actions
- personalizing tone and motivation
- future ranking refinement

## V1 AI Recommendation Inputs

AI should receive only scoped context needed for the explanation or refinement task.

Useful inputs may include:

- learner level
- learner goal
- active roadmap stage
- current recommended action
- related skill or subskill
- recent difficulty signals
- recent neglect signals

Avoid sending full learner history when a small context window is enough.

## Recommendation Explanation Examples

AI may produce explanations like:

- This resource supports your current roadmap stage and should help reinforce the grammar pattern you marked difficult.
- Speaking has been lighter this week, so this prompt gives you a small output task without interrupting your roadmap.
- This review item is due because you completed the block but marked the main resource as confusing.

These explanations should be short, practical, and connected to system state.

## What AI Should Not Do

AI should not:

- invent resources that are not in the curated library
- bypass roadmap constraints
- recommend unrelated content because it sounds interesting
- override review urgency without a system reason
- generate a completely new roadmap in V1

## Safe V1 Pattern

The safe V1 pattern is:

1. system generates recommendation candidates
2. system ranks candidates with rules
3. AI explains or lightly refines the chosen recommendation
4. UI displays the recommendation with clear reasoning

## Future Expansion

After V1, AI may help with:

- more nuanced ranking
- adaptive roadmap adjustments
- retention-aware recommendation priority
- deeper weak-area analysis
- personalized weekly planning

These should be built on top of the event and progress system, not outside it.

## Status

Active.

## Related Docs

- [Recommendation Logic](../system/recommendation-logic.md)
- [AI Role In V1](./ai-role-in-v1.md)
- [Future AI](./future-ai.md)
