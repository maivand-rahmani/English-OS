import { NextRequest, NextResponse } from "next/server";

import { getWritingFeedback } from "@/server/ai/writing-feedback";

export const maxDuration = 20;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { learnerLevel, taskPrompt, learnerResponse, roadmapContext } = body;

    if (!learnerLevel || !taskPrompt || !learnerResponse) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "bad_request",
            message:
              "Missing required fields: learnerLevel, taskPrompt, learnerResponse",
          },
        },
        { status: 400 },
      );
    }

    const result = await getWritingFeedback({
      learnerLevel,
      taskPrompt,
      learnerResponse,
      roadmapContext,
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
          message: "AI feedback is temporarily unavailable.",
        },
      },
      { status: 502 },
    );
  }
}
