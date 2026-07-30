import { Suspense, lazy } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

// The Three.js scene is heavy; load it only when the dashboard mounts.
const HeroScene = lazy(
  () => import("@/features/dashboard/components/hero-scene"),
);

function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="size-24 animate-pulse rounded-full bg-primary/20 blur-2xl" />
    </div>
  );
}

interface Hero3DProps {
  className?: string;
}

/** Lazy, reduced-motion-aware wrapper around the WebGL hero scene. */
export function Hero3D({ className }: Hero3DProps) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn("pointer-events-none select-none", className)}
      aria-hidden="true"
    >
      <Suspense fallback={<SceneFallback />}>
        <HeroScene reducedMotion={reducedMotion} />
      </Suspense>
    </div>
  );
}
