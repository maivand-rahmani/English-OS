# Speaking UX

## Purpose

This document defines the speaking workspace in English OS.

Speaking should be a real active-practice zone in V1 and one of the most emotionally valuable parts of the product.

## Role Of The Speaking Workspace

The speaking workspace should help the learner:

- speak regularly instead of only studying passively
- lower the barrier to active speaking practice
- reflect on performance
- receive useful feedback
- build confidence over time

## Speaking Model

V1 speaking should be prompt-based and session-based.

That means:

- the learner enters a speaking prompt or task
- records a session
- reviews transcript, reflection, or feedback

This keeps the experience concrete and repeatable.

## Main Speaking Surfaces

V1 should support:

- prompt list
- active recording flow
- transcript view
- verdict + feedback view
- post-feedback navigation (Try again, Next)
- self-reflection view
- speaking history

## V1 Navigation Model

Speaking is a focused mode inside the top-level Practice page in V1.

Speaking is not a separate top-level navigation section.

`Record` is an action, not a page.

Feedback and reflection belong inside an active speaking session or result state, not as sidebar routes.

Prompts and history may appear as lightweight sections, tabs, or panels inside the workspace, but not as separate V1 navigation pages unless they become real implemented subpages later.

## Core Speaking Flow

The main speaking flow should be:

1. Learner opens a prompt
2. Learner records a response (timer runs)
3. Learner picks a reflection and types a rough transcript
4. Learner saves the attempt
5. System auto-loads AI feedback with a verdict (pass / retry / needs_work) and a short summary
6. Learner picks Try again (starts a fresh session on the same prompt) or Next (advances to the next prompt, wrapping to first if on the last)
7. System stores history and patterns

## V1 Feedback Direction

Speaking V1 does not need to become a full speaking tutor.

But it should support a strong loop around:

- regular practice
- transcript visibility
- reflection
- lightweight feedback
- confidence-building continuity

## Speaking Principles

1. Speaking should feel approachable, not high-pressure.
2. The workspace should reduce fear of active use.
3. The learner should see evidence that speaking practice is accumulating.
4. Feedback should encourage the next session, not end the interaction.

## Relationship To The Rest Of The Product

- Dashboard can surface the next speaking task.
- Roadmap can connect speaking tasks to active blocks.
- Progress logic can track speaking frequency and confidence trends.
- Premium value can deepen through richer feedback and insights.

## Status

Active.

## Related Docs

- [AI Speaking Feedback](../ai/ai-speaking-feedback.md)
- [Progress Model](../system/progress-model.md)
- [Monetization](../product/monetization.md)
- [Roadmap UX](./roadmap.md)
