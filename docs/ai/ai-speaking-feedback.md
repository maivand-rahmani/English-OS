# AI Speaking Feedback

## Purpose

This document defines how AI supports speaking review in English OS.

Speaking feedback should help the learner practice active English more often and with less fear.

## Role In Product

AI speaking feedback should help the learner:

- understand what they said
- notice repeated issues
- improve fluency and clarity
- build confidence
- choose a concrete next speaking focus

V1 should not try to become a full pronunciation tutor.

## Input

The speaking feedback system may use:

- learner level
- speaking prompt
- transcript
- learner self-reflection
- roadmap context
- known recurring speaking patterns if available

Audio analysis may be added later, but transcript-based review is the safer V1 starting point.

## Output Shape

AI speaking feedback should be structured.

Recommended output fields:

- verdict (`pass` | `retry` | `needs_work`)
- feedbackSummary (short one-or-two-sentence summary of the verdict for the learner)
- overall_summary
- clarity_feedback
- grammar_feedback
- vocabulary_feedback
- fluency_feedback
- stronger_response_example
- next_practice_focus
- detected_patterns
- confidence_note

`verdict` is the routing signal that drives the Try again / Next actions in the UI:

- `pass` — fully addresses the task with only minor errors that don't impede meaning; the learner is ready to move on.
- `retry` — attempts the task but has significant issues (incomplete, off-prompt, major grammar breakdown); the learner should try again on the same task.
- `needs_work` — between pass and retry; the learner could move on but would benefit from another attempt.

## Feedback Dimensions

V1 speaking feedback should focus on:

- clarity
- grammar in spoken output
- vocabulary fit
- answer structure
- fluency at a practical level
- confidence and continuation

Pronunciation-specific feedback can be added later when audio analysis is intentionally supported.

## Reflection Support

Speaking should include learner reflection because transcript feedback alone may miss emotional difficulty.

Useful reflection signals:

- felt easy
- felt difficult
- did not know what to say
- vocabulary was missing
- grammar felt unstable
- want to repeat this prompt

These signals can feed progress and recommendation logic.

## Confidence Support

Speaking feedback should encourage repeat practice.

The product should avoid feedback that makes the learner feel punished for trying to speak.

Good feedback should identify one or two concrete next improvements and make the next session feel possible.

The `verdict` is the decision signal for whether the learner should Try again or move to the Next prompt. `pass` and `needs_work` should both feel encouraging, while `retry` should still point the learner toward a clear next attempt rather than a dead end.

## Speaking Flow

The speaking workspace should support a verdict-driven flow:

1. learner saves an attempt (with transcript or self-reflection)
2. AI speaking feedback is auto-triggered on save and returns a `verdict` plus structured `feedbackSummary` and dimensions
3. learner picks Try again or Next based on the verdict
4. on retry, the system stores the revised attempt for comparison

In V1, there is no separate "Get AI feedback" button. Feedback is auto-triggered when the learner saves or submits. If the AI call fails (network, timeout, validation), the UI still surfaces the error and allows the user to retry the request or move to the next task.

## V1 Limits

V1 does not need:

- live conversation AI
- real-time pronunciation scoring
- accent scoring
- complex fluency metrics
- full speaking exam evaluation

The goal is regular prompt-based practice with useful transcript-based feedback.

## Status

Active.

## Related Docs

- [Speaking UX](../ux/speaking.md)
- [AI Role In V1](./ai-role-in-v1.md)
- [Monetization](../product/monetization.md)
- [Progress Model](../system/progress-model.md)
