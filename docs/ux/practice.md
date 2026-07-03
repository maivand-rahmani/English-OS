# Practice UX

## Purpose

This document defines Practice as the V1 top-level output section in English OS.

It describes what belongs in the V1 Practice page now and what should wait for
the larger V2 expansion.

## V1 Role

Practice is the single top-level home for active output practice in V1.

Writing and speaking live inside Practice as modes, not as separate top-level
navigation sections.

## V1 Structure

V1 Practice should use:

- one top-level `Practice` page
- one large central workspace surface as the page's center of gravity
- one writing and speaking mode switch inside that surface
- one active writing or speaking workspace inside that same surface
- one inline AI feedback area with verdict and dual-action navigation inside that same surface (V1 already auto-loads feedback on save, see "AI Feedback V1 Behavior")
- minimal, honest product language

V1 Practice should not use:

- a traditional page header with a big `Practice` title or subtitle
- a hero section or top marketing block
- a repeated page title below the global navbar
- a Practice sidebar
- internal Practice sub-pages
- a two-column dashboard layout
- a right-side feedback panel
- a separate task card above the editor
- a separate editor card beside another equal-weight panel
- a nested card stack that makes Practice feel like a dashboard page
- dedicated history, archive, analytics, rubric, transcript review, or prompt library pages
- challenges or events as active V1 navigation items

## V1 Surface Model

The Practice page should not look like:

- title
- subtitle
- tabs
- content

Instead, V1 Practice should open directly into one polished workspace surface.

Inside that surface:

- the mode switch is the first thing the learner notices
- writing and speaking are modes, not separate top-level cards or panels
- only one mode is active at a time
- the active workspace updates in place inside the same surface
- the global navbar already identifies the section, so the page must not repeat a `Practice` header block

Writing mode should keep the editor as the visual center.

Speaking mode should keep the live speaking area or transcript handoff as the
visual center.

## Allowed Composition

The preferred V1 composition is:

1. one outer Practice studio surface
2. one integrated writing and speaking switch at the top
3. one dominant active workspace area
4. one inline AI feedback area near the bottom of the active workspace, showing the verdict (pass / retry / needs_work), a short summary, and two navigation actions: Try again (same task) and Next (next task, wrapping to first on the last task)

Small inline metadata is allowed only when it directly helps the task.

The layout should avoid chip clutter, duplicated labels, and equal-weight side
panels.

## Mode Responsibilities

Writing mode should cover task-based written output work.

Speaking mode should cover prompt-based spoken output work.

Both modes should remain connected to roadmap, recommendations, review, and
progress without becoming separate top-level product areas.

## AI Feedback V1 Behavior

V1 Practice already has a working inline AI feedback loop, not just a placeholder.

The behavior is:

- Saving a writing or speaking attempt auto-loads AI feedback into the same surface. There is no separate "Get AI feedback" button.
- The feedback includes a verdict with a one-sentence summary. The verdict is one of: `pass` (ready to move on), `retry` (try again on the same task), `needs_work` (one more pass is worth it).
- Below the feedback are two navigation actions: Try again (reset the draft or start a new session on the same task) and Next (advance to the next task in the queue, wrapping to the first task when on the last; on the last task Next shows as "Start over").
- The AI Honesty Rule still applies. If feedback fails to load (network or AI outage), the UI shows an honest error and the learner can still use Try again or Next to move on. The flow must not pretend feedback succeeded when it did not.

## AI Honesty Rule

Practice can reference future AI feedback direction, but it must not pretend the
full system already exists.

If feedback is not implemented yet, the UI and docs should describe it as
planned or future-ready, not as a finished capability.

## V2 Direction

In V2, Practice may grow into a larger section with internal navigation.

Potential future Practice sidebar items include:

- Writing
- Speaking
- Challenges
- Events
- Feedback
- History
- Progress
- other practice formats

That expansion is V2 scope only.

## Status

Active.

## Related Docs

- [Navigation](./navigation.md)
- [V1 Navigation Simplification Rule](./v1-navigation-simplification-rule.md)
- [Writing](./writing.md)
- [Speaking](./speaking.md)
