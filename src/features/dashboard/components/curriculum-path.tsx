import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Semester } from "@/types/curriculum";

interface CurriculumPathProps {
  semesters: Semester[];
}

/** A compact preview of the semester → module structure. */
export function CurriculumPath({ semesters }: CurriculumPathProps) {
  return (
    <div className="space-y-4">
      {semesters.map((semester) => (
        <Card key={semester.id}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{semester.title}</h3>
                  <Badge variant="secondary" className="text-[10px]">
                    {semester.modules.length} modules
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {semester.summary}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {semester.modules.map((mod) => {
                const lessonCount = mod.weeks.reduce(
                  (acc, w) => acc + w.lessons.length,
                  0,
                );
                return (
                  <Link
                    key={mod.id}
                    to="/learn"
                    className="group flex items-center justify-between rounded-lg border bg-background/50 px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-accent/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {mod.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {mod.weeks.length} weeks · {lessonCount} lessons
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
