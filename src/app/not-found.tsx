import { FileQuestion } from "lucide-react";
import { EmptyState } from "@/shared/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <EmptyState
        icon={FileQuestion}
        title="Page not found"
        description="The page you're looking for doesn't exist or has been moved."
        actions={[
          { label: "Go to dashboard", href: "/dashboard" },
          { label: "Go home", href: "/", variant: "outline" },
        ]}
      />
    </div>
  );
}
