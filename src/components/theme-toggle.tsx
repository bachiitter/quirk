"use client";

import { Button } from "~/components/ui/button";
import { useTheme } from "~/context/theme";

import { Icons } from "./ui/icons";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      className="w-10 rounded-xl"
      onClick={() => toggleTheme()}>
      <Icons.sun className="absolute w-[23px] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Icons.moon className="absolute w-[23px] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
