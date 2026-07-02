import { NextRequest, NextResponse } from "next/server";

import { getRecommendationExplanation } from "@/server/ai/recommendation-explanations";

export const maxDuration = 15;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      learnerLevel,
      learnerGoal,
      activeStageTitle,
      recommendedAction,
      relatedSkill,
      recentSignal,
    } = body;

    if (
      !learnerLevel ||
      !learnerGoal ||
      !activeStageTitle ||
      !recommendedAction ||
      !relatedSkill
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "bad_request",
            message:
              "Missing required fields: learnerLevel, learnerGoal, activeStageTitle, recommendedAction, relatedSkill",
          },
        },
        { status: 400 },
      );
    }

    const result = await getRecommendationExplanation({
      learnerLevel,
      learnerGoal,
      activeStageTitle,
      recommendedAction,
      relatedSkill,
      recentSignal,
    });

    if (result.error) {
      const status = result.error.code === "unavailable" ? 503 : 502;
      return NextResponse.json({ ok: false, error: result.error }, { status });
    }

    return NextResponse.json({ ok: true, data: result.data }, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "provider_error",
          message:
            "AI explanation is temporarily unavailable.",
        },
      },
      { status: 502 },
    );
  }
}
