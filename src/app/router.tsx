import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "@/components/layout/app-shell";
import { PlaceholderPage } from "@/components/common/placeholder-page";
import { NotFoundPage } from "@/features/errors/NotFoundPage";

// Heavy pages are lazy-loaded so their dependencies (markdown/refractor,
// recharts, 3D) stay out of the initial bundle.
const DashboardPage = lazy(() =>
  import("@/features/dashboard/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  })),
);
const CurriculaPage = lazy(() =>
  import("@/features/curriculum/CurriculaPage").then((m) => ({
    default: m.CurriculaPage,
  })),
);
const CurriculumOverviewPage = lazy(() =>
  import("@/features/curriculum/CurriculumOverviewPage").then((m) => ({
    default: m.CurriculumOverviewPage,
  })),
);
const LessonViewerPage = lazy(() =>
  import("@/features/lesson/LessonViewerPage").then((m) => ({
    default: m.LessonViewerPage,
  })),
);
const LessonEditorPage = lazy(() =>
  import("@/features/lesson/LessonEditorPage").then((m) => ({
    default: m.LessonEditorPage,
  })),
);
const StyleGuidePage = lazy(() =>
  import("@/features/style-guide/StyleGuidePage").then((m) => ({
    default: m.StyleGuidePage,
  })),
);

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
      { path: "curricula", element: <CurriculaPage /> },
      { path: "curricula/:curriculumId", element: <CurriculumOverviewPage /> },
      {
        path: "curricula/:curriculumId/n/:nodeId",
        element: <LessonViewerPage />,
      },
      {
        path: "curricula/:curriculumId/n/:nodeId/edit",
        element: <LessonEditorPage />,
      },
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
      ...(import.meta.env.DEV
        ? [{ path: "style-guide", element: <StyleGuidePage /> }]
        : []),
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
