import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Bookmark,
  ClipboardList,
  FlaskConical,
  LayoutDashboard,
  NotebookPen,
  Palette,
  Search,
  Trophy,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  /** Feature ships in a later phase; shown but flagged as upcoming. */
  upcoming?: boolean;
}

export interface NavSection {
  heading: string;
  items: NavItem[];
}

/**
 * Primary navigation. Routes are wired incrementally across phases; items with
 * `upcoming` render a subtle badge until their feature lands.
 */
export const navSections: NavSection[] = [
  {
    heading: "Overview",
    items: [
      { label: "Dashboard", to: "/", icon: LayoutDashboard },
      { label: "Curricula", to: "/curricula", icon: BookOpen },
      { label: "Search", to: "/search", icon: Search },
    ],
  },
  {
    heading: "Practice",
    items: [
      { label: "Labs", to: "/labs", icon: FlaskConical, upcoming: true },
      {
        label: "Assignments",
        to: "/assignments",
        icon: ClipboardList,
        upcoming: true,
      },
    ],
  },
  {
    heading: "Workspace",
    items: [
      { label: "Bookmarks", to: "/bookmarks", icon: Bookmark, upcoming: true },
      { label: "Notes", to: "/notes", icon: NotebookPen, upcoming: true },
      { label: "Achievements", to: "/achievements", icon: Trophy, upcoming: true },
    ],
  },
  // Dev-only tools, shown only in development builds.
  ...(import.meta.env.DEV
    ? [
        {
          heading: "Developer",
          items: [
            { label: "Style Guide", to: "/style-guide", icon: Palette },
          ],
        },
      ]
    : []),
];
