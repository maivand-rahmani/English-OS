# Writing UX

## Purpose

This document defines the writing workspace in English OS.

Writing should be a real active-practice zone in V1, not a decorative add-on.

## Role Of The Writing Workspace

The writing workspace should help the learner:

- practice written output regularly
- receive structured feedback
- notice repeated mistakes
- see improvement over time

This makes writing one of the strongest value layers for premium expansion later.

## Writing Model

V1 writing should be task-based with guided freedom.

That means:

- the system provides clear prompts or assignments
- the learner responds freely within a defined task shape

This is stronger than either pure freeform writing or rigid exercise-only writing.

## Main Writing Surfaces

V1 should support:

- task list
- active draft or submission state
- verdict + feedback view
- post-feedback navigation (Try again, Next)
- rewrite loop
- mistake history
- writing history

## V1 Navigation Model

Writing is a focused mode inside the top-level Practice page in V1.

Writing is not a separate top-level navigation section.

`New Draft` is an action, not a page.

Feedback belongs inside an active writing session or result state, not as a sidebar route.

In V1, the feedback view shows a verdict (pass / retry / needs_work) with a short summary, followed by two navigation actions: Try again (reopens the editor with the previous content on the same task) and Next (advances to the next task in the queue, wrapping to the first task when on the last).

Mistakes and history may appear as lightweight sections, tabs, or panels inside the workspace, but not as separate V1 navigation pages unless they become real implemented subpages later.

## Core Writing Flow

The main writing flow should be:

1. Learner opens a task
2. Learner writes a response
3. Learner saves the attempt
4. System shows AI feedback with a verdict (pass / retry / needs_work) and a short summary
5. Learner picks Try again (reopens the editor with previous content) or Next (advances to the next task in the queue, wrapping to first if on the last)
6. System stores patterns and history

## Writing Task Types

V1 can support a focused set of writing task shapes such as:

- short guided response
- journal-style reflection
- opinion paragraph
- structured practical answer

The exact taxonomy can evolve later, but the workspace should not feel unbounded.

## Feedback Goals

The writing workspace should eventually support:

- correction
- explanation
- better phrasing
- pattern detection
- next-step guidance

In V1, the UX should already be designed around this feedback loop even if the intelligence depth is still limited.

## Writing Principles

1. Writing should feel actionable, not intimidating.
2. Feedback should lead to improvement, not just highlight errors.
3. Mistake visibility should help the learner build memory.
4. Writing should connect back to roadmap and progress.

## Relationship To The Rest Of The Product

- Dashboard can surface the next writing task.
- Roadmap can link writing tasks to relevant stages or blocks.
- Progress logic can use writing activity and feedback patterns.
- Monetization can differentiate through deeper feedback and insight quality.

## Status

Active.

## Related Docs

- [AI Writing Feedback](../ai/ai-writing-feedback.md)
- [Progress Model](../system/progress-model.md)
- [Monetization](../product/monetization.md)
- [Roadmap UX](./roadmap.md)
