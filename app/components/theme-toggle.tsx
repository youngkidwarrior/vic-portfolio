import { Moon, Sun } from "@phosphor-icons/react";
import * as m from "motion/react-m";
import { useEffect, useState } from "react";
import { useMotionSettings } from "~/components/motion-system";

export function ThemeToggle() {
  const { reducedMotion } = useMotionSettings();
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(current);
  }, []);

  function toggleTheme() {
    const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  const accessibleLabel = theme
    ? `Switch to ${theme === "light" ? "dark" : "light"} theme`
    : "Toggle color theme";

  return (
    <m.button className="icon-button" type="button" onClick={toggleTheme} aria-label={accessibleLabel} whileTap={reducedMotion ? undefined : { scale: 0.9 }}>
      <m.span className="theme-symbol" initial={false} animate={{ rotate: reducedMotion ? 0 : theme === "dark" ? 90 : 0 }}>
        {theme === "dark" ? <Sun size={19} weight="bold" aria-hidden /> : <Moon size={19} weight="bold" aria-hidden />}
      </m.span>
    </m.button>
  );
}
