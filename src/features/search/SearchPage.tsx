import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, FileText, SearchIcon } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useSearch } from "@/data/queries/use-search";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function SearchPage() {
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId) ?? undefined;
  const [query, setQuery] = useState("");
  const { results } = useSearch(workspaceId, query);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Search</h1>
        <p className="text-sm text-muted-foreground">
          Fuzzy search across every curriculum and lesson.{" "}
          <span className="text-muted-foreground/70">
            Tip: press ⌘K anywhere.
          </span>
        </p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lessons, curricula, tags…"
          className="h-11 pl-9"
        />
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={SearchIcon}
          title={query.trim() ? "No matches" : "Start typing to search"}
          description={
            query.trim()
              ? "Try a different term or check your spelling."
              : "Results appear as you type."
          }
        />
      ) : (
        <div className="divide-y rounded-xl border">
          {results.map(({ doc }) => (
            <Link
              key={doc.id}
              to={doc.path}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/50"
            >
              {doc.type === "curriculum" ? (
                <BookOpen className="size-4 shrink-0 text-muted-foreground" />
              ) : (
                <FileText className="size-4 shrink-0 text-muted-foreground" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{doc.title}</p>
                {doc.subtitle && (
                  <p className="truncate text-xs text-muted-foreground">
                    {doc.subtitle}
                  </p>
                )}
              </div>
              {doc.tags.slice(0, 2).map((t) => (
                <Badge key={t} variant="outline" className="hidden text-[10px] sm:inline-flex">
                  {t}
                </Badge>
              ))}
              <Badge variant="secondary" className="shrink-0 text-[10px]">
                {doc.kindLabel}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
