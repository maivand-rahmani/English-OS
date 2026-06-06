# V1 Navigation Simplification Rule

## Rule

English OS V1 must not inflate the product with section sidebars and unfinished internal pages.

The V1 navigation model is top-level product sections only:

- Dashboard
- Roadmap
- Resources
- Writing
- Speaking
- Settings

Local sidebars are postponed to V2 and must not appear in the active V1 UI unless the internal pages are real, implemented, and necessary.

Do not convert filters, actions, states, or small content sections into navigation pages.

## Active V1 Model

Top-level product sections remain the only active navigation model in V1.

- Dashboard is the daily home and command center.
- Roadmap is one immersive roadmap page.
- Resources is one curated discovery and library page.
- Writing is one focused writing workspace.
- Speaking is one focused speaking workspace.
- Settings is one simple settings page.

Each main section should feel like one strong product experience rather than a shell full of shallow subpages.

## Implementation Rules

1. Do not show local section sidebars in the active V1 UI.
2. Do not create fake routes or unfinished placeholder pages for sidebar ideas.
3. Do not reserve empty sidebar space or decorative sidebar chrome when no real subpages exist.
4. Keep actions, filters, modal states, tabs, and inline sections inside the main page experience.
5. Navigation depth must reflect implemented product depth, not future feature inventory.

## Examples

- `New Draft` is an action, not a Writing sidebar page.
- `Record` is an action, not a Speaking sidebar page.
- `Grammar` is a Roadmap filter or layer, not a sidebar page.
- `Beginner` is a Resources filter or category state, not a sidebar page.
- `Recent Activity` is a Dashboard section, not a Dashboard sidebar page.

## Future V2 Note

Sidebar ideas may remain documented only as future V2 navigation concepts.

When they appear in planning docs, they must be treated as `Future V2 / not active in V1`.

## Related Docs

- [Navigation](./navigation.md)
- [Information Architecture](./information-architecture.md)
- [Mobile V1 Design](./mobile-v1-design.md)
- [V2 MVP Roadmap](../roadmap/futures/v2-mvp-roadmap.md)
