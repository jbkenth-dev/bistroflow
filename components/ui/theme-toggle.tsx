"use client";
import { useTheme } from "@/components/theme-provider";
import { IconMoon, IconSun } from "@/components/ui/icons";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      aria-label="Toggle theme"
      onClick={toggle}
      className="glass rounded-full p-2 hover:scale-105 transition-transform"
    >
      {theme === "dark" ? <IconMoon className="h-4 w-4" /> : <IconSun className="h-4 w-4" />}
    </button>
  );
}
