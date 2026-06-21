import { NextRequest, NextResponse } from "next/server";

import { getSpeakingFeedback } from "@/server/ai/speaking-feedback";

export const maxDuration = 20;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { learnerLevel, promptText, transcript, learnerReflection, roadmapContext } =
      body;

    if (!learnerLevel || !promptText || !transcript) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "bad_request",
            message:
              "Missing required fields: learnerLevel, promptText, transcript",
          },
        },
        { status: 400 },
      );
    }

    const result = await getSpeakingFeedback({
      learnerLevel,
      promptText,
      transcript,
      learnerReflection,
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
          message: "AI speaking feedback is temporarily unavailable.",
        },
      },
      { status: 502 },
    );
  }
}
