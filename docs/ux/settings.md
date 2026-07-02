# Settings UX

## Purpose

This document defines the settings area of English OS.

Settings should give the learner control over profile, goals, preferences, and system behavior without becoming a dumping ground for unrelated features.

## Role Of Settings

Settings exists to support the rest of the product.

It should allow the learner to update:

- who they are in the system
- what they want
- how they prefer to study
- how the product behaves around them

## Main Settings Areas

V1 settings should include:

- profile
- goals
- study intensity
- learning preferences
- appearance
- notifications
- account

## V1 Navigation Model

Settings is a shell-level utility overlay in V1, not a top-level product page.

The settings icon opens the overlay to Appearance. The avatar or account entry
opens the same overlay to Account. Profile, preferences, notifications, privacy,
and account controls use compact internal section navigation inside the modal.

Direct `/settings` access may render the same settings shell as a route fallback,
but it must not restore a dashboard-style Settings page.

## What Belongs Here

Examples of information that belongs in settings:

- current level
- current learning goal
- time availability
- preferred resource formats
- theme mode
- font preference
- text size
- interface density
- motion intensity
- reminder preferences

These settings should influence roadmap and recommendation behavior over time.

Appearance settings should influence the product interface through design tokens rather than hardcoded component styles.

## What Does Not Belong Here

Settings should not become:

- the main place for progress review
- a second dashboard
- a hidden feature graveyard

If a function matters daily, it likely belongs elsewhere.

## Settings Principles

1. Settings should feel calm and practical.
2. Important learning preferences should be easy to update.
3. The learner should understand that changing preferences can affect roadmap and recommendations.
4. Settings content should use rows and subtle dividers rather than cards or decorative panels.

## Future Expansion

Later, settings may include:

- billing
- data export
- more advanced personalization controls
- custom visual theme templates

But V1 should keep the area focused.

## Status

Active.

## Related Docs

- [Navigation](./navigation.md)
- [Onboarding](./onboarding.md)
- [Personas](../product/personas.md)
- [Monetization](../product/monetization.md)
- [Theme System](../brand/theme-system.md)
