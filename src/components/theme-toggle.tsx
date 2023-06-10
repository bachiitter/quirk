"use client";

import { Button } from "~/components/ui/button";
import { Icons } from "~/components/ui/icons";
import { useTheme } from "~/context/theme";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <Button variant="ghost" onClick={() => toggleTheme()}>
      <Icons.sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Icons.moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
