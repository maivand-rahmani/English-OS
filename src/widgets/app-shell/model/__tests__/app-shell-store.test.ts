import { act } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";

import { useAppShellStore } from "../app-shell-store";

beforeEach(() => {
  act(() => {
    useAppShellStore.setState({
      settingsOpen: false,
      settingsSection: null,
      activityOpen: false,
    });
  });
});

describe("useAppShellStore", () => {
  test("starts with all overlays closed (settingsOpen=false, settingsSection=null, activityOpen=false)", () => {
    const state = useAppShellStore.getState();
    expect(state.settingsOpen).toBe(false);
    expect(state.settingsSection).toBeNull();
    expect(state.activityOpen).toBe(false);
  });

  test("openSettings(section) sets settingsOpen=true and the active section", () => {
    act(() => {
      useAppShellStore.getState().openSettings("appearance");
    });
    const state = useAppShellStore.getState();
    expect(state.settingsOpen).toBe(true);
    expect(state.settingsSection).toBe("appearance");
  });

  test("openSettings() with no argument opens the overlay with a null section", () => {
    act(() => {
      useAppShellStore.getState().openSettings();
    });
    const state = useAppShellStore.getState();
    expect(state.settingsOpen).toBe(true);
    expect(state.settingsSection).toBeNull();
  });

  test("closeSettings clears the overlay flag and the active section", () => {
    act(() => {
      useAppShellStore.getState().openSettings("profile");
    });
    expect(useAppShellStore.getState().settingsOpen).toBe(true);

    act(() => {
      useAppShellStore.getState().closeSettings();
    });
    const state = useAppShellStore.getState();
    expect(state.settingsOpen).toBe(false);
    expect(state.settingsSection).toBeNull();
  });

  test("setSettingsSection changes the section without toggling the overlay", () => {
    act(() => {
      useAppShellStore.getState().setSettingsSection("data");
    });
    const state = useAppShellStore.getState();
    expect(state.settingsSection).toBe("data");
    expect(state.settingsOpen).toBe(false);
  });

  test("openActivity and closeActivity toggle the activity panel", () => {
    act(() => {
      useAppShellStore.getState().openActivity();
    });
    expect(useAppShellStore.getState().activityOpen).toBe(true);

    act(() => {
      useAppShellStore.getState().closeActivity();
    });
    expect(useAppShellStore.getState().activityOpen).toBe(false);
  });

  test("toggleActivity flips the activity panel on each call", () => {
    act(() => {
      useAppShellStore.getState().toggleActivity();
    });
    expect(useAppShellStore.getState().activityOpen).toBe(true);

    act(() => {
      useAppShellStore.getState().toggleActivity();
    });
    expect(useAppShellStore.getState().activityOpen).toBe(false);
  });
});
