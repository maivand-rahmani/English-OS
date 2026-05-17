# System Architecture

## Purpose

This document defines the high-level system architecture of English OS.

It explains how the product should work internally as a structured learning system before implementation details are chosen.

## Architecture Philosophy

English OS should be system-first, not AI-first.

That means:

- the product logic should live in the product system
- AI should support the system rather than replace it
- the first version should work coherently through strong rules, entities, and flows

This is important because the product's value comes from structure, guidance, and continuity, not from prompt-only behavior.

## Major System Layers

### 1. Learner Profile Layer

This layer stores who the learner is in the system:

- level
- goals
- available study time
- strongest skills
- weakest skills
- learning preferences

This layer is created during onboarding and should influence roadmap, recommendations, and practice.

### 2. Curriculum And Curation Layer

This layer stores the product-controlled learning inventory:

- skills and subskills
- roadmap templates
- roadmap stages and blocks
- curated resources
- writing tasks
- speaking prompts

This is not user-generated learning chaos. It is the editorial and structural backbone of the product.

### 3. Learner Roadmap Layer

This layer connects a specific learner to a roadmap:

- assigned stages
- assigned blocks
- learner-specific block states
- learner adaptation signals

It turns general roadmap design into a personal study path.

### 4. Activity Capture Layer

This layer records what the learner actually does:

- resource starts and completions
- review interactions
- writing submissions
- speaking sessions
- skips
- difficulty signals
- reflection signals

This layer is essential because English OS should track real behavior, not only planned behavior.

### 5. Progress Inference Layer

This layer interprets raw activity into meaningful product states:

- improving
- neglected
- completed
- weak
- needs review
- inconsistent

This is how the product becomes more than a simple tracker.

### 6. Review Layer

This layer decides what should be revisited and when:

- resource review
- block review
- writing mistake review
- speaking pattern review

V1 should use rule-based review logic, but the system should be designed so future AI can improve prioritization.

### 7. Recommendation Layer

This layer decides what the learner should do next:

- main roadmap action
- best next resource
- review priority
- writing or speaking action

This layer powers the dashboard and makes English OS feel like a true control center.

### 8. Practice Layer

This layer manages active output work:

- writing tasks and submissions
- speaking prompts and sessions
- feedback records
- mistake and pattern memory

### 9. AI Support Layer

This layer enhances the system through:

- writing feedback
- speaking feedback
- recommendation explanation
- insight generation
- later personalization improvements

AI should enrich these areas, but the system should still have clear non-AI ownership of product logic.

## Core Domain Boundaries

The product should be thought of as several connected domains:

- learner domain
- roadmap domain
- resource domain
- activity domain
- progress domain
- review domain
- practice domain
- recommendation domain

This domain separation will make engineering cleaner later.

## High-Level Data Flow

### Onboarding Flow

1. learner provides profile inputs
2. system creates learner profile
3. system assigns roadmap template or initial roadmap state
4. system selects first recommended resources
5. system builds initial dashboard state

### Ongoing Learning Flow

1. learner completes or interacts with a resource or task
2. system records activity event
3. progress inference updates learner state
4. review system updates due items
5. recommendation layer recomputes next actions
6. dashboard reflects the updated system state

## Product Logic vs AI Logic

### Product Logic Should Own

- roadmap assignment
- roadmap structure
- resource metadata
- activity capture
- progress state definitions
- review triggers
- recommendation candidate generation

### AI Can Support

- feedback depth
- explanation quality
- insight phrasing
- ranking refinements
- future personalization

If core system behavior depends entirely on AI, the architecture is drifting in the wrong direction.

## V1 Architectural Priorities

The first version should optimize for:

- clean domain modeling
- strong system state
- simple but reliable rules
- traceable learning history
- extensibility for future AI and analytics

## Status

Active.

## Related Docs

- [Data Model](./data-model.md)
- [Progress Model](./progress-model.md)
- [Recommendation Logic](./recommendation-logic.md)
- [AI Role In V1](../ai/ai-role-in-v1.md)
