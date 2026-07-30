import { Link, useRouteError } from "react-router-dom";
import { Ghost } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Route-level error boundary + 404 fallback. */
export function NotFoundPage() {
  const error = useRouteError() as { statusText?: string; message?: string };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <Ghost className="size-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          {error?.statusText ??
            error?.message ??
            "The page you are looking for doesn't exist or has moved."}
        </p>
      </div>
      <Button asChild>
        <Link to="/">Back to dashboard</Link>
      </Button>
    </div>
  );
}
