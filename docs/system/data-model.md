# Data Model

## Purpose

This document defines the core entities and relationships of English OS.

The data model should make it possible to support roadmap logic, curated resources, progress tracking, review, writing, speaking, and future AI enhancement without rebuilding the product foundation later.

## Modeling Principles

1. Separate product-controlled content from learner-specific state.
2. Store raw activity before deriving higher-level inferences.
3. Keep roadmap, resource, review, and practice models connected but not collapsed into one table or concept.
4. Design V1 data so richer analytics and AI can be added later.

## Core Entity Groups

### Learner Entities

These define who the learner is in the system.

- `learner`
  The main user account.
- `learner_profile`
  Level, goals, study intensity, preferences, strongest skills, weakest skills.
- `learner_preferences`
  Resource format preferences, notification preferences, practice preferences.

## Product-Controlled Learning Structure

These entities are curated by the product team.

- `skill`
  High-level skill such as grammar, vocabulary, reading, listening, writing, speaking.
- `subskill`
  More specific learning targets such as article usage, past tense handling, listening for gist, opinion paragraph writing.
- `roadmap_template`
  A reusable roadmap structure for a user type or goal shape.
- `roadmap_stage`
  A major stage within a roadmap template.
- `roadmap_block`
  A meaningful learning unit inside a stage.
- `block_skill_map`
  Mapping between blocks and the skills or subskills they target.

## Curated Resource Entities

- `resource`
  A curated external or wrapped learning resource.
- `resource_skill_map`
  Mapping between resources and skill or subskill targets.
- `resource_collection`
  Editorial collections such as grouped recommendations or themed resource sets.
- `resource_collection_item`
  Relationship between a collection and its resources.

### Important Resource Fields

Each resource should eventually support fields such as:

- title
- source
- url or external reference
- type
- level
- format
- estimated_time
- difficulty
- skill fit
- why_recommended
- best_use_case
- follow_up_hint
- free_or_paid

## Learner-Specific Roadmap State

- `learner_roadmap`
  The learner's assigned roadmap instance.
- `learner_stage_state`
  The learner's status for each roadmap stage.
- `learner_block_state`
  The learner's status for each roadmap block.
- `block_feedback_signal`
  Lightweight learner reactions such as too easy, too hard, not useful, skip for now.

### Typical Block States

- not_started
- in_progress
- completed
- needs_review
- skipped_for_now

## Activity And History Entities

These entities record what the learner actually does.

- `learning_event`
  The canonical event stream for user activity.
- `resource_activity`
  Resource-specific interaction state.
- `review_activity`
  Review-specific actions.
- `session_activity`
  General study-session metadata if needed later.

### Example Event Types

- resource_started
- resource_completed
- resource_marked_difficult
- block_started
- block_completed
- review_done
- writing_submitted
- speaking_recorded
- item_skipped

## Progress Entities

These entities represent interpreted learner progress, not raw activity.

- `skill_progress_state`
  The learner's current visible progress state per skill or subskill.
- `block_progress_state`
  The learner's visible state per roadmap block.
- `learner_insight`
  System-generated observations such as "writing consistency improving" or "speaking neglected recently".

These can be stored as snapshots, recomputed views, or a hybrid depending on engineering choice later.

## Review Entities

- `review_item`
  A due or future review item in the unified review system.
- `review_source`
  What generated the review item, such as resource, block, writing mistake, or speaking pattern.
- `review_state`
  Due state, urgency, snooze state, completion state.

### Review Item Types

- resource_review
- block_review
- writing_mistake_review
- speaking_pattern_review

## Writing Entities

- `writing_task`
  A curated writing assignment or prompt.
- `learner_writing_attempt`
  The learner's submission for a writing task.
- `writing_feedback`
  Feedback record attached to an attempt.
- `writing_mistake_pattern`
  Repeated or notable mistake categories tied to the learner over time.

## Speaking Entities

- `speaking_prompt`
  A curated speaking prompt or scenario.
- `learner_speaking_session`
  A recorded speaking session by the learner.
- `speaking_transcript`
  Transcript or transcript reference for a session.
- `speaking_feedback`
  Feedback record attached to a session.
- `speaking_pattern`
  Repeated issues or signals surfaced over time.

## Recommendation Entities

Recommendation may begin as computed logic without heavy persistence, but these entities may still be useful:

- `recommended_action`
  The next-action object shown on dashboard or other surfaces.
- `daily_plan`
  The current daily action bundle for the learner.
- `recommendation_reason`
  A structured explanation for why something was recommended.

## Relationship Summary

The most important system relationships are:

- learner -> learner_profile
- learner -> learner_roadmap
- learner_roadmap -> learner_stage_state -> learner_block_state
- roadmap_block -> resource
- roadmap_block -> writing_task
- roadmap_block -> speaking_prompt
- learner -> learning_event
- learning_event -> progress inference
- progress inference -> review_item
- progress inference -> recommended_action
- writing attempts and speaking sessions -> learner insights and review items

## V1 Modeling Choice

V1 should use a hybrid model:

- curated roadmap and resources are product-authored
- learner state is personalized and dynamic
- raw activity is retained
- progress and recommendation are derived from rules

This will make later engineering and AI work much easier.

## Status

Active.

## Related Docs

- [Architecture](./architecture.md)
- [Progress Model](./progress-model.md)
- [Review System](./review-system.md)
- [Database Design](../engineering/database-design.md)
