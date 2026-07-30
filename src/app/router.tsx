import { createBrowserRouter } from "react-router-dom"

import { RootLayout } from "@/app/root-layout"
import { PlaceholderPage } from "@/app/placeholder-page"
import { DashboardPage } from "@/features/dashboard/dashboard-page"

/**
 * Route tree mirrors the content hierarchy (Semester -> Module -> Week ->
 * Lesson). Deeper routes are stubbed for now and will resolve real content
 * via loaders once the content engine (Phase 2) exists — the URL shape is
 * decided now so it doesn't change later.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: "semester/:semesterSlug",
        element: <PlaceholderPage label="Semester overview" />,
      },
      {
        path: "semester/:semesterSlug/module/:moduleSlug",
        element: <PlaceholderPage label="Module overview" />,
      },
      {
        path: "semester/:semesterSlug/module/:moduleSlug/week/:weekSlug",
        element: <PlaceholderPage label="Week overview" />,
      },
      {
        path: "lesson/:lessonSlug",
        element: <PlaceholderPage label="Lesson" />,
      },
    ],
  },
])
