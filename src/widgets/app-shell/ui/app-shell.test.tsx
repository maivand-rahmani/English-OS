import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import { AppShell } from "./app-shell";

const usePathnameMock = vi.fn();
const routerReplaceMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
  useRouter: () => ({
    replace: routerReplaceMock,
  }),
}));

const account = {
  displayName: "Grace Hopper",
  email: "grace@example.com",
  isAuthenticated: true,
};

describe("AppShell", () => {
  beforeEach(() => {
    usePathnameMock.mockReset();
    routerReplaceMock.mockReset();
    localStorage.clear();
  });

  test("renders the mobile shell with bottom navigation", async () => {
    usePathnameMock.mockReturnValue("/practice");
    installMatchMedia(390);

    render(
      <AppShell account={account}>
        <div>Shell content</div>
      </AppShell>,
    );

    const mobileNavigation = await screen.findByRole("navigation", {
      name: /primary mobile navigation/i,
    });

    expect(mobileNavigation).toBeInTheDocument();
    expect(within(mobileNavigation).getAllByRole("link")).toHaveLength(4);
    expect(screen.getByRole("button", { name: /^settings$/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /practice/i })).not.toBeInTheDocument();
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
      <AppShell account={account}>
        <div>Shell content</div>
      </AppShell>,
    );

    const topNavigation = await screen.findByRole("navigation", {
      name: /top navigation/i,
    });

    expect(within(topNavigation).getAllByRole("link")).toHaveLength(4);
    expect(screen.getByRole("button", { name: /^settings$/i })).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/search resources/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /dashboard/i })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: /primary mobile navigation/i }),
    ).not.toBeInTheDocument();
  });

  test("opens appearance from the settings utility and account from the avatar", async () => {
    usePathnameMock.mockReturnValue("/dashboard");
    installMatchMedia(1280);

    render(
      <AppShell account={account}>
        <div>Shell content</div>
      </AppShell>,
    );

    fireEvent.click(screen.getByRole("button", { name: /^settings$/i }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: "Appearance" })).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole("button", { name: /close settings/i }));
    expect(routerReplaceMock).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /open account settings/i }));

    const accountDialog = await screen.findByRole("dialog");
    expect(within(accountDialog).getByRole("heading", { name: "Account" })).toBeInTheDocument();
    expect(within(accountDialog).getByText("grace@example.com")).toBeInTheDocument();
  });

  test("closes direct settings access to the dashboard", async () => {
    usePathnameMock.mockReturnValue("/settings");
    installMatchMedia(1280);

    render(
      <AppShell account={account}>
        <div>Shell content</div>
      </AppShell>,
    );

    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: /close settings/i }));

    expect(routerReplaceMock).toHaveBeenCalledWith("/dashboard");
  });

  test("closes direct settings access with Escape", async () => {
    usePathnameMock.mockReturnValue("/settings");
    installMatchMedia(1280);

    render(
      <AppShell account={account}>
        <div>Shell content</div>
      </AppShell>,
    );

    await screen.findByRole("dialog");
    fireEvent.keyDown(document, { key: "Escape" });

    expect(routerReplaceMock).toHaveBeenCalledWith("/dashboard");
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
