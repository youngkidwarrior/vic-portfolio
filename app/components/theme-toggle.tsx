import { Moon, Sun } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
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
    <button className="icon-button" type="button" onClick={toggleTheme} aria-label={accessibleLabel}>
      {theme === "dark" ? <Sun size={19} weight="bold" aria-hidden /> : <Moon size={19} weight="bold" aria-hidden />}
    </button>
  );
}
