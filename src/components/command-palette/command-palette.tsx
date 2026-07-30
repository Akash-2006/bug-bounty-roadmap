import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  Library,
  Moon,
  Plus,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { useSearch } from "@/data/queries/use-search";
import { useThemeStore } from "@/stores/theme-store";
import { useUIStore } from "@/stores/ui-store";
import { useWorkspaceStore } from "@/stores/workspace-store";

/**
 * Global ⌘K command palette: fuzzy search across curricula and lessons (Fuse.js)
 * plus quick navigation commands. Mounted once in the app shell.
 */
export function CommandPalette() {
  const open = useUIStore((s) => s.commandOpen);
  const setOpen = useUIStore((s) => s.setCommandOpen);
  const workspaceId = useWorkspaceStore((s) => s.activeWorkspaceId) ?? undefined;
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const { results } = useSearch(workspaceId, query);

  // Global hotkey: ⌘K / Ctrl+K toggles the palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!useUIStore.getState().commandOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  // Clear the query whenever the palette closes.
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function run(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild aria-describedby={undefined}>
              <motion.div
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="fixed left-1/2 top-[15vh] z-[80] w-[92vw] max-w-xl -translate-x-1/2"
              >
                <Dialog.Title className="sr-only">Command palette</Dialog.Title>
                <Command
                  shouldFilter={false}
                  className="border shadow-2xl"
                  loop
                >
                  <CommandInput
                    autoFocus
                    placeholder="Search lessons, curricula, or run a command…"
                    value={query}
                    onValueChange={setQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    {query.trim() === "" && (
                      <CommandGroup heading="Actions">
                        <CommandItem
                          value="go-dashboard"
                          onSelect={() => run(() => navigate("/"))}
                        >
                          <LayoutDashboard /> Go to Dashboard
                        </CommandItem>
                        <CommandItem
                          value="go-curricula"
                          onSelect={() => run(() => navigate("/curricula"))}
                        >
                          <Library /> Go to Curricula
                        </CommandItem>
                        <CommandItem
                          value="new-curriculum"
                          onSelect={() => run(() => navigate("/curricula"))}
                        >
                          <Plus /> New curriculum
                        </CommandItem>
                        <CommandItem
                          value="toggle-theme"
                          onSelect={() => run(toggleTheme)}
                        >
                          <Moon /> Toggle theme
                        </CommandItem>
                      </CommandGroup>
                    )}

                    {results.length > 0 && (
                      <CommandGroup
                        heading={query.trim() ? "Results" : "Jump to"}
                      >
                        {results.map(({ doc }) => (
                          <CommandItem
                            key={doc.id}
                            value={`${doc.id}-${doc.title}`}
                            onSelect={() => run(() => navigate(doc.path))}
                          >
                            {doc.type === "curriculum" ? (
                              <BookOpen className="text-muted-foreground" />
                            ) : (
                              <FileText className="text-muted-foreground" />
                            )}
                            <span className="min-w-0 flex-1 truncate">
                              {doc.title}
                            </span>
                            {doc.subtitle && (
                              <span className="hidden max-w-[40%] truncate text-xs text-muted-foreground sm:inline">
                                {doc.subtitle}
                              </span>
                            )}
                            <Badge
                              variant="secondary"
                              className="shrink-0 text-[10px]"
                            >
                              {doc.kindLabel}
                            </Badge>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
