# Motion Direction

## Purpose

This document defines the motion direction for English OS.

Motion is part of the product identity. It should make English OS feel alive, responsive, intelligent, and premium.

## Motion Thesis

English OS should be a motion-led product.

The interface should not feel like static cards that simply appear and disappear. It should feel like a learning system that reacts, updates, shifts, and remembers.

Motion should support the [Soft Liquid OS](./style-doctrine.md) direction.

## Motion Personality

Motion should feel:

- smooth
- premium
- controlled
- tactile
- responsive
- intelligent
- calm but alive

Motion should not feel:

- childish
- chaotic
- overly bouncy
- decorative without meaning
- slow enough to block work

## High-Priority Motion Moments

These moments should receive special attention:

- app shell entering after onboarding
- dashboard widgets revealing in sequence
- top navigation active state moving between sections
- sidebar icons changing active state
- today plan updating
- progress bars and charts changing values
- roadmap blocks expanding and collapsing
- resources being marked complete
- review queue items reprioritizing
- writing feedback appearing
- speaking session ending and transcript appearing
- AI insight cards generating or refreshing

## Navigation Motion

Navigation should feel fluid.

Examples:

- active top-nav pill slides or morphs into place
- page sections transition without harsh cuts
- sidebar active state has a tactile press or glow
- route changes preserve shell continuity

The shell should feel stable while content changes inside it.

## Dashboard Motion

Dashboard should feel alive because it is the control center.

Useful patterns:

- staggered widget reveal
- animated metric changes
- progress bars filling smoothly
- charts drawing or updating
- recommendation card emphasis on update
- review queue shifting position when priority changes

Dashboard motion should communicate that the system is reading and organizing the learner's state.

## Practice Motion

Writing and speaking should have richer interactive motion because they are active workspaces.

Writing examples:

- draft panel focus transitions
- feedback sections unfolding
- rewrite comparison reveal
- mistake tags appearing contextually

Speaking examples:

- recording state animation
- waveform movement
- transcript reveal
- session completion transition
- feedback panel entrance

## Implementation Principles

When implementing motion:

- prefer reusable motion primitives
- respect reduced-motion preferences
- keep durations consistent
- avoid motion that causes layout instability
- animate state transitions, not random decoration
- make loading and AI waiting states feel intentional

## Reduced Motion

The product should support reduced motion.

Reduced motion should:

- remove large transitions
- keep necessary state feedback
- avoid parallax or large movement
- preserve usability

## Status

Active.

## Related Docs

- [Design Principles](./design-principles.md)
- [Style Doctrine](./style-doctrine.md)
- [Visual Direction](./visual-direction.md)
- [Frontend Architecture](../engineering/frontend-architecture.md)
- [Release Criteria](../roadmap/release-criteria.md)
