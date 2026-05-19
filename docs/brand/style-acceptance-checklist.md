# Style Acceptance Checklist

## Purpose

This checklist defines whether an English OS UI implementation is visually acceptable.

Use it before accepting dashboard, shell, roadmap, resources, writing, speaking, or settings UI work.

## Core Rule

If the desktop UI does not feel clearly related to the canonical dashboard reference at first glance, it is not acceptable for V1.

Do not fix an off-direction layout by adding colors, shadows, or animation.

Fix the structure first.

## Desktop Frame Checklist

The desktop implementation should answer yes to these:

- Does the page use a large rounded app canvas inside an atmospheric background?
- Does it have a slim left icon rail?
- Does it use centered pill navigation?
- Does the active navigation/control state use strong black styling?
- Does it have a right-side utility cluster or contextual area where appropriate?
- Does the dashboard use a wide primary panel plus a narrower right column?
- Does it use two or three secondary cards instead of a large widget grid?
- Do panels feel soft, rounded, premium, and lightly layered?
- Does the screen feel calm from a distance?

## Minimalism Checklist

The UI should answer yes to these:

- Is there one dominant focus?
- Is the next action obvious?
- Is every visible module useful?
- Is copy short and directive?
- Is there enough whitespace?
- Are analytics shown only when they help the learner decide what to do next?
- Are decorative widgets avoided?
- Are there fewer competing colors than a typical edtech dashboard?

## English OS Fit Checklist

The UI should answer yes to these:

- Does it feel like a learning operating system?
- Does it feel like a serious personal tool?
- Does it guide the learner instead of showing random content?
- Does it avoid course-marketplace energy?
- Does it avoid Duolingo-style gamification?
- Does it make resources, roadmap, progress, and practice feel connected?

## Theme And Styling Checklist

The implementation should answer yes to these:

- Are product colors driven by tokens or CSS variables?
- Are font choices tokenized?
- Are radius, shadow, spacing, and motion values tokenized?
- Can colors be refined without rewriting components?
- Is the default palette elegant and calm rather than loud or childish?
- Are pastel accents restrained?
- Are black active states preserved?

## Motion Checklist

Motion should answer yes to these:

- Does navigation transition smoothly?
- Do panels enter with intentional rhythm?
- Do progress changes animate meaningfully?
- Do hover and press states feel tactile?
- Is motion rich but controlled?
- Does the UI respect reduced-motion preferences?

## Mobile Checklist

Mobile should answer yes to these:

- Does it feel like the same product system?
- Is the layout adapted instead of squeezed?
- Are cards prioritized into focused flows?
- Are touch targets comfortable?
- Is typography readable?
- Is the next action still obvious?
- Is the interface calm in short study sessions?

## Automatic Fail Conditions

Reject or revise the UI if:

- it looks like a default shadcn dashboard
- it looks like a generic SaaS admin panel
- it does not resemble the canonical reference frame
- it is overloaded with equal-weight widgets
- it uses too many bright gradients
- it relies on dark mode to feel premium
- it hides weak structure behind animation
- it feels like a course platform or live-class app
- it has no clear next action
- it is desktop-only or mobile-only

## Status

Active.

## Related Docs

- [Style Doctrine](./style-doctrine.md)
- [Visual Direction](./visual-direction.md)
- [Reference Notes](./reference-notes.md)
- [Design Principles](./design-principles.md)
- [Dashboard UX](../ux/dashboard.md)
