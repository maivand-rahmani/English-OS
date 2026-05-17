# Milestones

## Purpose

This document defines the major milestones on the path to the English OS MVP.

Milestones are checkpoints, not task dumps.

## Milestone 1: Documentation Foundation Complete

Outcome:

- product thesis is defined
- UX structure is defined
- system model is defined
- engineering direction is defined
- AI boundaries are defined

Completion definition:

- docs are internally consistent
- no major unresolved architecture direction remains
- implementation can begin from documentation

## Milestone 2: Technical Foundation Running

Outcome:

- Next.js app is created
- TypeScript is configured
- Tailwind and shadcn/ui are ready
- Prisma is configured
- Auth.js direction is in place
- FSD structure exists

Completion definition:

- app runs locally
- project structure matches docs
- first route renders successfully

## Milestone 3: App Shell Complete

Outcome:

- top bar exists
- per-section sidebar exists
- main authenticated layout exists
- primary routes exist

Completion definition:

- user can navigate between Dashboard, Roadmap, Resources, Writing, Speaking, and Settings
- shell is reusable across routes

## Milestone 4: Local-First State Foundation Complete

Outcome:

- browser persistence layer exists
- local learning event queue exists
- high-frequency learner state can be saved locally

Completion definition:

- progress-like actions can update without backend requests
- local events can be inspected or read by product logic
- sync boundary is clear even if server sync is not complete

## Milestone 5: Core Content And Roadmap Model Working

Outcome:

- initial roadmap template exists
- initial resource catalog exists
- skills/subskills are represented
- writing tasks and speaking prompts exist

Completion definition:

- dashboard and roadmap can use structured content
- resources include recommendation context

## Milestone 6: Dashboard V1 Working

Outcome:

- dashboard displays learner state
- today plan exists
- best next resource appears
- review preview appears
- writing and speaking actions appear

Completion definition:

- dashboard gives a clear next step
- dashboard changes when local learner state changes

## Milestone 7: Roadmap And Resources Working

Outcome:

- roadmap blocks can be viewed and updated
- resources can be browsed and opened
- resource completion/reflection works locally

Completion definition:

- learner can move through roadmap-resource flow
- resource actions generate local learning events

## Milestone 8: Writing And Speaking Workspaces Working

Outcome:

- writing tasks can be opened and submitted
- speaking prompts can be opened and completed as sessions
- local practice history exists

Completion definition:

- both practice zones feel like real product areas
- dashboard can link into them

## Milestone 9: Review And Recommendations Working

Outcome:

- rule-based review items appear
- daily plan is generated
- recommendation reasons appear

Completion definition:

- system can guide the learner based on local state
- review and recommendations are explainable

## Milestone 10: AI-Light Layer Working

Outcome:

- writing feedback works
- speaking feedback works from transcript or structured input
- AI calls are server-side

Completion definition:

- AI improves writing/speaking without owning core product logic
- structured responses are handled safely

## Milestone 11: Launch-Ready MVP

Outcome:

- product is deployed
- core flows work end to end
- responsive and animation polish are acceptable
- release criteria are met

Completion definition:

- product can be shared with real users
- V1 feels like a coherent English OS MVP

## Status

Active.

## Related Docs

- [V1 MVP Roadmap](./v1-mvp-roadmap.md)
- [Release Criteria](./release-criteria.md)
- [Decision Log](../decisions/decision-log.md)
