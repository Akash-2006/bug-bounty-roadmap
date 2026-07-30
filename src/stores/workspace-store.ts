import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WorkspaceState {
  /** The currently active workspace id, or null before bootstrap. */
  activeWorkspaceId: string | null;
  setActiveWorkspace: (id: string) => void;
}

/** Remembers which workspace the user was last in (ADR: UI/session state). */
export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      activeWorkspaceId: null,
      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
    }),
    { name: "bbu:workspace" },
  ),
);
