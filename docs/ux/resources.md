# Resources UX

## Purpose

This document defines the curated resource experience inside English OS.

Resources are a core value layer in V1. They should help the learner stop searching endlessly and start trusting the system's guidance.

The Resources page must behave like one cohesive curated discovery experience,
not like a dashboard made from stacked support blocks.

## Role Of The Resources Section

The resources section should answer:

- what resources are actually worth using
- which resources fit my level and goals
- why this resource is recommended
- what should I use after this

This section should feel like a guided editorial library, not an open database.

## Resource Strategy

V1 should be external-resource-first with structured product wrapping.

That means:

- the learning resource itself may be external
- English OS adds context, recommendation logic, structure, and tracking around it

The product should guide the learner to the best path, not try to replace the entire internet.

## Resources Page Model

Resources must not be documented or implemented as:

- a command-center block followed by recommendation, filters, results, sidebar,
  and status blocks
- a heavy admin-style dashboard
- a page where every feature gets its own large competing container
- a page with nested cards inside nested cards

The page should instead prefer:

- one integrated discovery surface
- lightweight filters
- compact resource rows or tiles
- progressive disclosure
- large detail modal for deep context
- minimal visible complexity

## Resource Browse Requirements

The main browse surface should communicate only the highest-signal metadata:

- title
- source
- level fit
- primary skill fit
- estimated time
- why it is recommended
- current learner state
- primary action

Deeper context such as detailed rationale, source trust notes, usage plans,
follow-up actions, and roadmap links should move into progressive disclosure,
not stay permanently expanded inside every resource tile.

This is what separates English OS from a link list.

## Main Resource Surfaces

V1 should support:

- recommended resources
- editorial collections
- integrated search and discovery
- skill-based browsing
- level-based browsing
- roadmap-linked resources

## Filters And Organization

The resource experience should be filterable by:

- level
- skill
- format
- use case

But filtering should remain secondary to editorial guidance and personalized recommendation.

Filters should be lightweight and integrated into the discovery experience
rather than presented as a separate heavyweight page block.

## User Contribution Policy

V1 should not allow users to add their own resources into the system as first-class resources.

Reason:

- it weakens curation quality
- it increases system complexity
- it moves the product away from trusted guidance

The curated layer should remain intentional and controlled.

## Completion And Reflection

After engaging with a resource, the learner should be able to record light signals such as:

- completed
- useful
- difficult
- needs review

This creates a bridge between resource use and system intelligence.

## Relationship To The Rest Of The Product

- Roadmap uses resources to power progression.
- Dashboard highlights the best next resource.
- Progress and review use signals from resource activity.
- Writing and Speaking may connect to resources as preparation or follow-up.

## Resources Principles

1. Curation is more important than volume.
2. Explanation is as important as recommendation.
3. The learner should understand why a resource appears now.
4. The section should feel trustworthy, not overwhelming.
5. The page should remain a cohesive library experience, not a dashboard.

## Status

Active.

## Related Docs

- [Roadmap UX](./roadmap.md)
- [Layout Principles](./layout-principles.md)
- [Dashboard](./dashboard.md)
- [Recommendation Logic](../system/recommendation-logic.md)
- [Monetization](../product/monetization.md)
