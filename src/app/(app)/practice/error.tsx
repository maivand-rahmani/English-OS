"use client";

import { useEffect } from "react";
import { ErrorState } from "@/shared/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center p-8">
      <ErrorState
        title="Practice failed to load"
        message="The practice studio could not be loaded right now."
        onRetry={reset}
      />
    </div>
  );
}
