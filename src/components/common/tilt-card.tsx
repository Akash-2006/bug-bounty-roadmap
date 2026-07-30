import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  maxTilt?: number;
}

/**
 * A pointer-reactive 3D tilt wrapper. Tracks the cursor position over the card
 * and rotates it in perspective, with a soft glare highlight. Spring-smoothed
 * and pointer-agnostic (no-op on touch/keyboard).
 */
export function TiltCard({ children, className, maxTilt = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.4 };
  const rotateX = useSpring(
    useTransform(y, [0, 1], [maxTilt, -maxTilt]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(x, [0, 1], [-maxTilt, maxTilt]),
    springConfig,
  );
  const glareX = useTransform(x, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(y, [0, 1], ["0%", "100%"]);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  function reset() {
    x.set(0.5);
    y.set(0.5);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={cn("relative [transform-style:preserve-3d]", className)}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 [background:radial-gradient(120px_circle_at_var(--gx)_var(--gy),hsl(var(--primary)/0.18),transparent_60%)] group-hover:opacity-100"
        style={
          {
            "--gx": glareX,
            "--gy": glareY,
          } as React.CSSProperties
        }
      />
    </motion.div>
  );
}
