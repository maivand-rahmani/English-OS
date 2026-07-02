"use client";

import { useEffect } from "react";
import { ErrorState } from "@/shared/ui";

export default function GlobalError({
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
    <html>
      <body className="min-h-screen bg-background antialiased">
        <main className="flex min-h-screen items-center justify-center p-4">
          <ErrorState
            title="Something went wrong"
            message="An unexpected error occurred. Please try reloading the page."
            onRetry={reset}
          />
        </main>
      </body>
    </html>
  );
}
