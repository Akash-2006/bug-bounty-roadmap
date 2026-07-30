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
const KnowledgeGraphPage = lazy(() =>
  import("@/features/graph/KnowledgeGraphPage").then((m) => ({
    default: m.KnowledgeGraphPage,
  })),
);
const QuizRunnerPage = lazy(() =>
  import("@/features/quiz/QuizRunnerPage").then((m) => ({
    default: m.QuizRunnerPage,
  })),
);
const StyleGuidePage = lazy(() =>
  import("@/features/style-guide/StyleGuidePage").then((m) => ({
    default: m.StyleGuidePage,
  })),
);
const SearchPage = lazy(() =>
  import("@/features/search/SearchPage").then((m) => ({
    default: m.SearchPage,
  })),
);
const SettingsPage = lazy(() =>
  import("@/features/settings/SettingsPage").then((m) => ({
    default: m.SettingsPage,
  })),
);
const ReviewPage = lazy(() =>
  import("@/features/review/ReviewPage").then((m) => ({
    default: m.ReviewPage,
  })),
);
const AchievementsPage = lazy(() =>
  import("@/features/achievements/AchievementsPage").then((m) => ({
    default: m.AchievementsPage,
  })),
);
const BookmarksPage = lazy(() =>
  import("@/features/annotations/BookmarksPage").then((m) => ({
    default: m.BookmarksPage,
  })),
);
const NotesPage = lazy(() =>
  import("@/features/annotations/NotesPage").then((m) => ({
    default: m.NotesPage,
  })),
);
const AssignmentsPage = lazy(() =>
  import("@/features/assignments/AssignmentsPage").then((m) => ({
    default: m.AssignmentsPage,
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
        path: "curricula/:curriculumId/graph",
        element: <KnowledgeGraphPage />,
      },
      {
        path: "curricula/:curriculumId/n/:nodeId",
        element: <LessonViewerPage />,
      },
      {
        path: "curricula/:curriculumId/n/:nodeId/edit",
        element: <LessonEditorPage />,
      },
      {
        path: "curricula/:curriculumId/n/:nodeId/quiz",
        element: <QuizRunnerPage />,
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
        element: <SearchPage />,
      },
      {
        path: "assignments",
        element: <AssignmentsPage />,
      },
      { path: "review", element: <ReviewPage /> },
      {
        path: "bookmarks",
        element: <BookmarksPage />,
      },
      {
        path: "notes",
        element: <NotesPage />,
      },
      {
        path: "achievements",
        element: <AchievementsPage />,
      },
      { path: "settings", element: <SettingsPage /> },
      ...(import.meta.env.DEV
        ? [{ path: "style-guide", element: <StyleGuidePage /> }]
        : []),
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
