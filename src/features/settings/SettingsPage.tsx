import { useRef, useState } from "react";
import {
  Download,
  FileJson,
  Loader2,
  Monitor,
  Moon,
  Sun,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  useExportWorkspaceJson,
  useImportJson,
} from "@/data/queries/use-io";
import { useThemeStore, type Theme } from "@/stores/theme-store";
import { useWorkspaceStore } from "@/stores/workspace-store";

const THEMES: { key: Theme; label: string; icon: typeof Sun }[] = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "system", label: "System", icon: Monitor },
];

export function SettingsPage() {
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId) ?? undefined;
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const exportJson = useExportWorkspaceJson(workspaceId);
  const importJson = useImportJson(workspaceId);
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setMessage(null);
    setError(null);
    try {
      const result = await importJson.mutateAsync(file);
      setMessage(
        `Imported ${result.curricula} curriculum(s) and ${result.nodes} node(s).`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Appearance and your data. Everything is stored locally in your browser.
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {THEMES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1.5 rounded-lg border p-3 text-sm transition-colors",
                  theme === key
                    ? "border-primary bg-accent text-accent-foreground"
                    : "hover:bg-accent/50",
                )}
              >
                <Icon className="size-5" />
                {label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1 justify-start"
              onClick={() => exportJson.mutate()}
              disabled={exportJson.isPending}
            >
              {exportJson.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Download />
              )}
              Export workspace (JSON)
            </Button>
            <Button
              variant="outline"
              className="flex-1 justify-start"
              onClick={() => fileRef.current?.click()}
              disabled={importJson.isPending}
            >
              {importJson.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Upload />
              )}
              Import from JSON
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handleFile}
            />
          </div>

          {message && (
            <p className="rounded-md border border-success/40 bg-success/10 px-3 py-2 text-sm text-success">
              {message}
            </p>
          )}
          {error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <FileJson className="mt-0.5 size-4 shrink-0" />
            Imports never overwrite existing data — they're added as new
            curricula. Export a single curriculum as Markdown from its page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
