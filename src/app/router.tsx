import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "@/components/layout/app-shell";
import { PlaceholderPage } from "@/components/common/placeholder-page";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { NotFoundPage } from "@/features/errors/NotFoundPage";

/**
 * Application routes. `AppShell` is the layout route wrapping every page.
 * Placeholder routes are wired now so navigation is complete; their features
 * are implemented in later phases.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: "learn",
        element: (
          <PlaceholderPage
            title="Curriculum"
            description="The semester → module → week → lesson explorer ships in Phase 2."
          />
        ),
      },
      {
        path: "search",
        element: (
          <PlaceholderPage
            title="Search"
            description="Fuzzy search across all lessons and labs is coming soon."
          />
        ),
      },
      {
        path: "labs",
        element: <PlaceholderPage title="Labs" />,
      },
      {
        path: "assignments",
        element: <PlaceholderPage title="Assignments" />,
      },
      {
        path: "bookmarks",
        element: <PlaceholderPage title="Bookmarks" />,
      },
      {
        path: "notes",
        element: <PlaceholderPage title="Notes" />,
      },
      {
        path: "achievements",
        element: <PlaceholderPage title="Achievements" />,
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
