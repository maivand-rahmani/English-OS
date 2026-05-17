# AI Writing Feedback

## Purpose

This document defines how AI supports writing review in English OS.

Writing feedback is one of the most valuable V1 AI use cases because it turns English OS from a planner into an active improvement system.

## Role In Product

AI writing feedback should help the learner:

- understand mistakes
- improve clarity
- improve naturalness
- notice repeated patterns
- rewrite with purpose

It should not make the learner feel judged or buried under corrections.

## Input

The writing feedback system may use:

- learner level
- writing task prompt
- learner response
- current roadmap context
- relevant writing goal
- known recurring mistake patterns if available

Do not send unnecessary full learner history.

## Output Shape

AI feedback should be structured.

Recommended output fields:

- overall_summary
- corrected_version
- key_issues
- naturalness_suggestions
- grammar_notes
- vocabulary_suggestions
- next_practice_focus
- detected_patterns

Structured output makes it easier to store feedback, build mistake memory, and show consistent UI.

## Feedback Dimensions

V1 writing feedback should focus on:

- grammar accuracy
- sentence structure
- clarity
- naturalness
- vocabulary fit
- task completion

Avoid trying to be a full academic writing evaluator in V1.

## Tone

Feedback should be:

- direct
- calm
- specific
- improvement-oriented
- not overly apologetic
- not overloaded with too many corrections at once

The learner should leave with a next step, not just a list of errors.

## Mistake Pattern Memory

Writing feedback should support future pattern tracking.

Examples:

- articles
- tense consistency
- word order
- awkward phrasing
- missing prepositions
- repetitive vocabulary

In V1, pattern memory can begin as simple structured tags returned by AI and stored locally or server-side later.

## Rewrite Loop

The writing workspace should support a rewrite flow:

1. learner submits writing
2. AI gives feedback
3. learner rewrites
4. system compares or stores the revised attempt

This turns feedback into practice rather than passive correction.

## V1 Limits

V1 does not need:

- perfect scoring
- CEFR certification
- long essay grading
- teacher-level rubrics
- complex plagiarism detection

The goal is useful, repeatable feedback for beginner and intermediate self-learners.

## Status

Active.

## Related Docs

- [Writing UX](../ux/writing.md)
- [AI Role In V1](./ai-role-in-v1.md)
- [Monetization](../product/monetization.md)
- [Progress Model](../system/progress-model.md)
