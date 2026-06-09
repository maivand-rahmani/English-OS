import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { AppShell } from "./app-shell";

const usePathnameMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
}));

describe("AppShell", () => {
  beforeEach(() => {
    usePathnameMock.mockReset();
  });

  test("renders the mobile shell with bottom navigation", async () => {
    usePathnameMock.mockReturnValue("/resources");
    installMatchMedia(390);

    render(
      <AppShell userLabel="Grace Hopper">
        <div>Shell content</div>
      </AppShell>,
    );

    const mobileNavigation = await screen.findByRole("navigation", {
      name: /primary mobile navigation/i,
    });

    expect(mobileNavigation).toBeInTheDocument();
    expect(within(mobileNavigation).getAllByRole("link")).toHaveLength(5);
    expect(screen.getByRole("link", { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /resources/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("list", { name: /resources lanes/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: /top navigation/i })).not.toBeInTheDocument();
    expect(screen.getByText("Shell content")).toBeInTheDocument();
  });

  test("renders the desktop shell without bottom navigation", async () => {
    usePathnameMock.mockReturnValue("/dashboard");
    installMatchMedia(1280);

    render(
      <AppShell userLabel="Grace Hopper">
        <div>Shell content</div>
      </AppShell>,
    );

    const topNavigation = await screen.findByRole("navigation", {
      name: /top navigation/i,
    });

    expect(within(topNavigation).getAllByRole("link")).toHaveLength(5);
    expect(screen.getByRole("link", { name: /settings/i })).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/search resources/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: /primary mobile navigation/i }),
    ).not.toBeInTheDocument();
  });
});

function installMatchMedia(width: number) {
  const currentWidth = width;
  const mediaQueries: Array<{
    listeners: Set<(event: MediaQueryListEvent) => void>;
    media: string;
    matches: boolean;
    onchange: ((event: MediaQueryListEvent) => void) | null;
  }> = [];

  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => {
      const mediaQuery = {
        media: query,
        matches: matchesQuery(query, currentWidth),
        onchange: null,
        listeners: new Set<(event: MediaQueryListEvent) => void>(),
        addEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
          mediaQuery.listeners.add(listener);
        },
        removeEventListener: (_event: string, listener: (event: MediaQueryListEvent) => void) => {
          mediaQuery.listeners.delete(listener);
        },
        addListener: (listener: (event: MediaQueryListEvent) => void) => {
          mediaQuery.listeners.add(listener);
        },
        removeListener: (listener: (event: MediaQueryListEvent) => void) => {
          mediaQuery.listeners.delete(listener);
        },
        dispatchEvent: () => false,
      };

      mediaQueries.push(mediaQuery);
      return mediaQuery;
    },
  });

  for (const mediaQuery of mediaQueries) {
    const nextMatches = matchesQuery(mediaQuery.media, currentWidth);
    if (nextMatches === mediaQuery.matches) {
      continue;
    }

    mediaQuery.matches = nextMatches;
    const event = {
      matches: nextMatches,
      media: mediaQuery.media,
    } as MediaQueryListEvent;
    mediaQuery.listeners.forEach((listener) => listener(event));
    mediaQuery.onchange?.(event);
  }
}

function matchesQuery(query: string, width: number) {
  const minWidthMatch = query.match(/min-width:\s*(\d+)px/);

  if (minWidthMatch) {
    return width >= Number(minWidthMatch[1]);
  }

  const maxWidthMatch = query.match(/max-width:\s*(\d+)px/);

  if (maxWidthMatch) {
    return width <= Number(maxWidthMatch[1]);
  }

  return false;
}
