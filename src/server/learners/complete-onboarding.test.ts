import { describe, expect, test, vi, beforeEach } from "vitest";

// Hoist shared mock state so vi.mock factories can reference it.
// (vi.mock is hoisted to the top of the file, before any const declarations.)
const mocks = vi.hoisted(() => {
  const mockProfile = { id: "prof-1" };
  return {
    auth: vi.fn(),
    learnerProfile: {
      upsert: vi.fn().mockResolvedValue(mockProfile),
      findUnique: vi.fn().mockResolvedValue(mockProfile),
      update: vi.fn().mockResolvedValue(mockProfile),
    },
    revalidatePath: vi.fn(),
    cookies: {
      get: vi.fn().mockReturnValue(undefined),
      set: vi.fn(),
    },
  };
});

vi.mock("@/server/auth", () => ({
  auth: mocks.auth,
}));

vi.mock("@/server/db/prisma", () => ({
  prisma: {
    learnerProfile: mocks.learnerProfile,
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue(mocks.cookies),
}));

import { auth } from "@/server/auth";
import { prisma } from "@/server/db/prisma";
import { completeOnboarding } from "./complete-onboarding";

const validInput = {
  currentLevel: "A2" as const,
  mainGoal: "BUILD_FOUNDATION" as const,
  studyMinutesPerDay: 20,
  strongestSkill: "vocabulary" as const,
  weakestSkill: "speaking" as const,
  preferredFormats: ["video" as const],
  mainPainPoint: "NO_STRUCTURE" as const,
};

describe("completeOnboarding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.cookies.get.mockReturnValue(undefined);
    (auth as ReturnType<typeof vi.fn>).mockResolvedValue(null);
  });

  test("rejects invalid input", async () => {
    const result = await completeOnboarding({ currentLevel: "INVALID" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors?.currentLevel).toBeDefined();
    }
  });

  test("rejects when studyMinutesPerDay is out of range", async () => {
    const result = await completeOnboarding({ ...validInput, studyMinutesPerDay: 500 });
    expect(result.success).toBe(false);
  });

  test("rejects when preferredFormats is empty", async () => {
    const result = await completeOnboarding({ ...validInput, preferredFormats: [] });
    expect(result.success).toBe(false);
  });

  test("creates profile for guest user (no session) and sets cookie", async () => {
    (auth as ReturnType<typeof vi.fn>).mockResolvedValue(null);
    const result = await completeOnboarding(validInput);
    expect(result.success).toBe(true);
    expect(mocks.cookies.set).toHaveBeenCalled();
    expect(prisma!.learnerProfile.upsert).toHaveBeenCalled();
  });

  test("creates profile for authenticated user", async () => {
    (auth as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    const result = await completeOnboarding(validInput);
    expect(result.success).toBe(true);
    expect(prisma!.learnerProfile.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-1" },
      }),
    );
  });

  test("is idempotent — second call updates the same row", async () => {
    (auth as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: "user-1" },
    });
    await completeOnboarding(validInput);
    await completeOnboarding({ ...validInput, studyMinutesPerDay: 30 });
    expect(prisma!.learnerProfile.upsert).toHaveBeenCalledTimes(2);
  });
});
