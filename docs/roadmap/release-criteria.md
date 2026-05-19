# Release Criteria

## Purpose

This document defines what must be true for English OS V1 MVP to be considered launch-ready.

The MVP should be small enough to ship, but polished enough to feel like a real product.

## Product Readiness

V1 is product-ready when:

- the product clearly feels like an English learning operating system
- onboarding creates a meaningful learner setup
- dashboard tells the learner what to do next
- roadmap gives a structured path
- resources feel curated and trustworthy
- writing and speaking are real workspaces
- review and recommendations exist in useful V1 form

## UX Readiness

V1 is UX-ready when:

- top-level navigation works
- per-section sidebars work
- dashboard is the primary daily home
- main flows are clear without explanation text
- empty states are intentional
- loading states are calm
- errors are understandable
- desktop browser layout feels like a premium control center
- mobile web layout feels like a focused pocket version of the same system
- mobile and desktop layouts are both usable, polished, and consistent

## System Readiness

V1 is system-ready when:

- local-first learner state works
- local learning events are recorded
- roadmap state can change
- resource activity affects progress
- review items can be generated
- recommendations use system state
- AI does not own core product state

## Engineering Readiness

V1 is engineering-ready when:

- app runs locally
- project follows documented structure
- Auth.js is wired or launch-auth path is clear
- Prisma is configured
- environment variables are documented
- OpenAI calls are server-side
- client persistence is behind clear adapters
- deployment to Vercel works

## AI Readiness

V1 AI is ready when:

- writing feedback works from a writing attempt
- speaking feedback works from transcript or structured speaking input
- AI outputs are structured
- provider errors are handled
- API keys are never exposed to the client
- product still works when AI features are unavailable

## Content Readiness

V1 content is ready when:

- initial roadmap template exists for beginner/intermediate self-learners
- resource catalog has enough curated resources to support the MVP journey
- resources include metadata and recommendation context
- writing tasks exist
- speaking prompts exist
- no placeholder content appears in user-facing core flows

## Motion And Visual Polish

V1 visual polish is ready when:

- app shell feels stable and intentional
- desktop shell clearly resembles the canonical dashboard reference
- dashboard uses the reference's app canvas, left rail, pill nav, panel rhythm, and right column structure
- dashboard has clear hierarchy
- dashboard feels minimal, edited, and calm
- animations make the interface feel alive and intelligent
- motion does not block usability
- transitions help the user understand state changes
- the product does not look like a default component template

## Launch Blockers

Do not launch if:

- onboarding leads to an empty dashboard
- dashboard cannot recommend a clear next action
- resources look like an unstructured link dump
- progress actions are unreliable
- AI keys can be exposed
- app only works on one viewport size
- mobile feels like an afterthought
- desktop UI looks like a generic shadcn/admin dashboard
- dashboard is overloaded with too many competing widgets
- implementation does not visually relate to the canonical reference
- core navigation feels confusing

## Launch Definition

English OS V1 is launch-ready when a beginner or intermediate self-learner can:

1. start onboarding
2. receive a useful setup
3. land on dashboard
4. see what to do next
5. open roadmap and resources
6. complete actions locally
7. practice writing or speaking
8. see progress, review, or recommendations change

## Status

Active.

## Related Docs

- [V1 MVP Roadmap](./v1-mvp-roadmap.md)
- [MVP Definition](../product/mvp.md)
- [Tech Stack](../engineering/tech-stack.md)
- [Frontend Architecture](../engineering/frontend-architecture.md)
