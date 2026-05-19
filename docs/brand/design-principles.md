# Design Principles

## Purpose

This document defines the core design principles for English OS.

It does not finalize the visual style. The final visual style should be refined after reference images are added.

## Product Feel

English OS should feel like:

- a calm control center
- a serious personal tool
- a premium study dashboard
- an intelligent system that understands the learner
- a place the learner can return to every day

The canonical UI/UX style direction is [Soft Liquid OS](./style-doctrine.md).

## Interface Philosophy

The interface should prioritize:

- clarity
- hierarchy
- focus
- confidence
- daily usefulness
- motion-driven feedback
- tactile interaction
- premium softness

The product should not feel like a noisy edtech app, a playful streak machine, or a generic admin dashboard.

## Structure Principle

The product should use a strong application-shell structure:

- large rounded app canvas
- persistent top navigation
- persistent vertical sidebar
- dense but breathable dashboard regions
- large primary work area
- secondary right-side panels where useful

This structure should feel like a serious operating system, not a marketing website.

For V1 desktop, the supplied dashboard reference is the structural baseline.

Agents should not invent a different shell unless the decision log is updated first.

## Minimalism Principle

Minimalism is a product requirement, not a decoration style.

English OS should reduce the learner's anxiety by editing the interface down to what matters.

This means:

- fewer visible choices
- stronger hierarchy
- less explanatory copy
- no decorative metrics
- no crowded widget grids
- no random feature cards
- one clear next action whenever possible

Minimalism here does not mean flat, empty, or boring.

It means the product feels calm because everything visible has a job.

## Motion Principle

Animation should be a core part of the English OS experience.

Motion should help the user feel:

- the system is alive
- progress is changing
- recommendations are updating
- the dashboard is responding
- learning state has continuity

Motion should not be random decoration. It should communicate state, transition, attention, and progress.

Motion should be abundant enough to become part of the product identity.

The target is not minimal motion. The target is rich, controlled, high-quality motion.

## Motion Use Cases

Animation should be used for:

- dashboard entry and refresh
- widget reveal
- progress state changes
- roadmap block transitions
- review queue updates
- resource completion
- writing feedback reveal
- speaking session completion
- navigation between product zones

## Calmness Rules

Even with many animations, the product should remain calm.

Motion should be:

- smooth
- intentional
- readable
- not distracting
- not childish
- not overly bouncy

The product can have a lot of animation, but the animation should feel controlled and intelligent.

## Tactile Surface Rules

The product should feel touchable and interactive.

Useful patterns:

- active navigation pills with animated movement
- cards that respond subtly to hover and focus
- progress areas that animate when values change
- panels that transition smoothly between states
- controls that feel physical without becoming skeuomorphic

Avoid flat, static dashboard behavior where the UI only changes by hard cuts.

## Themeable Product Principle

The visual system should be built through variables and design tokens.

English OS should support:

- light theme
- dark theme
- future custom themes
- configurable font family
- configurable text scale
- configurable interface density
- configurable motion intensity

Style values should not be hardcoded directly into components when they represent product design decisions.

Components should consume tokens such as color, surface, radius, typography, spacing, shadow, and motion variables.

## Serious Tool Principles

English OS should look and behave like a tool the learner can trust.

This means:

- strong layout discipline
- clear dashboard hierarchy
- readable typography
- restrained but memorable visual language
- no random decorative noise
- no childish gamification patterns
- no overloaded dashboard surfaces

## Status

Active, canonical desktop reference selected.

## Related Docs

- [Visual Direction](./visual-direction.md)
- [Style Doctrine](./style-doctrine.md)
- [Motion Direction](./motion-direction.md)
- [Theme System](./theme-system.md)
- [Reference Notes](./reference-notes.md)
- [Dashboard](../ux/dashboard.md)
- [Product Thesis](../product/thesis.md)
- [Frontend Architecture](../engineering/frontend-architecture.md)
