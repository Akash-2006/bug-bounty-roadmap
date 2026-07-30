import { mockCurriculum } from "@/lib/mock-curriculum"
import { ModuleNode } from "@/features/dashboard/components/module-node"

/**
 * Renders each semester as a horizontal roadmap row of module nodes —
 * the roadmap.sh-inspired centerpiece of the dashboard.
 */
export function RoadmapOverview() {
  return (
    <div className="space-y-8">
      {mockCurriculum.map((semester) => (
        <div key={semester.id}>
          <h3 className="mb-3 font-display text-sm font-semibold text-text-muted">
            {semester.title}
          </h3>
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-2">
              {semester.modules.map((mod, i) => (
                <div key={mod.id} className="relative flex items-center">
                  {i > 0 && (
                    <div
                      className="absolute right-full top-7 h-px w-6 bg-border-strong"
                      aria-hidden
                    />
                  )}
                  <ModuleNode module={mod} semesterSlug={semester.slug} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
