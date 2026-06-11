import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import { SettingsCenter } from "./settings-center";

const guestAccount = {
  displayName: "Guest mode",
  email: null,
  isAuthenticated: false,
};

describe("SettingsCenter", () => {
  test("updates and persists appearance preferences", async () => {
    installMatchMedia(1280);
    localStorage.clear();

    render(
      <SettingsCenter
        account={guestAccount}
        activeSection="appearance"
        onActiveSectionChange={vi.fn()}
        onOpenChange={vi.fn()}
        open
      />,
    );

    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: /theme: system/i }));
    fireEvent.click(await screen.findByRole("button", { name: "Dark" }));

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    expect(localStorage.getItem("english-os:appearance-preferences")).toContain(
      '"theme":"dark"',
    );
  });

  test("applies system theme using the current color-scheme preference", async () => {
    installMatchMedia(1280, true);
    localStorage.clear();

    render(
      <SettingsCenter
        account={guestAccount}
        activeSection="appearance"
        onActiveSectionChange={vi.fn()}
        onOpenChange={vi.fn()}
        open
      />,
    );

    await screen.findByRole("dialog");

    expect(document.documentElement).toHaveAttribute("data-theme", "dark");
  });

  test("marks notification controls as unavailable previews", async () => {
    installMatchMedia(1280);

    render(
      <SettingsCenter
        account={guestAccount}
        activeSection="notifications"
        onActiveSectionChange={vi.fn()}
        onOpenChange={vi.fn()}
        open
      />,
    );

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByText(/notification delivery is not connected/i),
    ).toBeInTheDocument();

    const toggles = within(dialog).getAllByRole("switch");
    expect(toggles).toHaveLength(3);
    toggles.forEach((toggle) => expect(toggle).toBeDisabled());
  });
});

function installMatchMedia(width: number, prefersDark = false) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: matchesQuery(query, width, prefersDark),
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

function matchesQuery(query: string, width: number, prefersDark: boolean) {
  if (query.includes("prefers-color-scheme: dark")) {
    return prefersDark;
  }

  const minWidthMatch = query.match(/min-width:\s*(\d+)px/);
  return minWidthMatch ? width >= Number(minWidthMatch[1]) : false;
}
