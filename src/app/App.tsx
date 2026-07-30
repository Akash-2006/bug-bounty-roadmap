import { RouterProvider } from "react-router-dom";

import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/app/providers/query-provider";
import { useApplyTheme } from "@/hooks/use-apply-theme";
import { router } from "@/app/router";

export function App() {
  useApplyTheme();

  return (
    <QueryProvider>
      <TooltipProvider delayDuration={200}>
        <RouterProvider router={router} />
      </TooltipProvider>
    </QueryProvider>
  );
}
