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
        title="Dashboard failed to load"
        message="The dashboard could not be loaded right now. This might be a temporary issue."
        onRetry={reset}
      />
    </div>
  );
}
