import { useEffect } from "react";

import { useThemeStore } from "@/stores/theme-store";

/**
 * Applies the persisted theme preference to the document root and keeps it in
 * sync with the OS setting when `theme === "system"`.
 */
export function useApplyTheme() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const apply = () => {
      const resolved =
        theme === "system" ? (media.matches ? "dark" : "light") : theme;
      root.classList.toggle("dark", resolved === "dark");
    };

    apply();

    if (theme === "system") {
      media.addEventListener("change", apply);
      return () => media.removeEventListener("change", apply);
    }
  }, [theme]);
}
