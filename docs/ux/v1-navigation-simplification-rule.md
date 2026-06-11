# V1 Navigation Simplification Rule

## Rule

English OS V1 must not inflate the product with section sidebars and unfinished
internal pages.

The V1 navigation model is top-level product sections only:

- Dashboard
- Roadmap
- Resources
- Practice

Settings should be a shell-level overlay accessed from a header utility button.
The `/settings` route remains only as a direct-access fallback for the same
overlay.

Local sidebars are postponed to V2 and must not appear in the active V1 UI
unless the internal pages are real, implemented, and necessary.

Do not convert filters, actions, states, or small content sections into
navigation pages.

## Active V1 Model

Top-level product sections remain the only active navigation model in V1.

- Dashboard is the daily home and command center.
- Roadmap is one immersive roadmap page.
- Resources is one curated discovery and library page.
- Practice is one focused V1 output page containing writing and speaking modes.
- Settings is one compact modal system reached from the header utility area.

Each main section should feel like one strong product experience rather than a
shell full of shallow subpages.

## Consequences

1. Do not create section sidebars for V1.
2. Do not create fake routes or unfinished placeholder pages for sidebar ideas.
3. Do not reserve empty sidebar space or decorative sidebar chrome when no real subpages exist.
4. Keep actions, filters, modal states, tabs, and inline sections inside the main page experience.
5. Navigation depth must reflect implemented product depth, not future feature inventory.

## Examples

- `Writing` is a Practice mode, not a top-level V1 navigation item.
- `Speaking` is a Practice mode, not a top-level V1 navigation item.
- `New Draft` is an action inside Practice writing mode, not a sidebar page.
- `Record` is an action inside Practice speaking mode, not a sidebar page.
- `Grammar` is a Roadmap filter or layer, not a sidebar page.
- `Beginner` is a Resources filter or category state, not a sidebar page.
- `Recent Activity` is a Dashboard section, not a Dashboard sidebar page.

## Future V2 Note

Sidebar ideas may remain documented only as future V2 navigation concepts.

When they appear in planning docs, they must be treated as `Future V2 / not active in V1`.

## Related Docs

- [Navigation](./navigation.md)
- [Information Architecture](./information-architecture.md)
- [Practice](./practice.md)
- [Writing](./writing.md)
- [Speaking](./speaking.md)
- [Mobile V1 Design](./mobile-v1-design.md)
- [V2 MVP Roadmap](../roadmap/futures/v2-mvp-roadmap.md)
