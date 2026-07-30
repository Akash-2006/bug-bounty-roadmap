import { cn } from "@/lib/utils";
import type { DifficultyLevel } from "@/core/schemas/base";

const styles: Record<DifficultyLevel, string> = {
  beginner: "bg-difficulty-beginner/15 text-difficulty-beginner",
  intermediate: "bg-difficulty-intermediate/15 text-difficulty-intermediate",
  advanced: "bg-difficulty-advanced/15 text-difficulty-advanced",
  expert: "bg-difficulty-expert/15 text-difficulty-expert",
};

const labels: Record<DifficultyLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

interface DifficultyPillProps {
  difficulty: DifficultyLevel;
  className?: string;
}

/** A semantic pill communicating lesson difficulty with a paired label. */
export function DifficultyPill({ difficulty, className }: DifficultyPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        styles[difficulty],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {labels[difficulty]}
    </span>
  );
}
