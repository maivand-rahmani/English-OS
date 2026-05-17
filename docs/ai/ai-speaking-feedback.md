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

- overall_summary
- clarity_feedback
- grammar_feedback
- vocabulary_feedback
- fluency_feedback
- stronger_response_example
- next_practice_focus
- detected_patterns
- confidence_note

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
