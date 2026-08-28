import { List, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import { ThemeToggle } from "~/components/theme-toggle";

const navigationId = "primary-navigation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const nav = [
    ["Work", "/#work"],
    ["About", "/#about"],
    ["Resume", "/resume"],
  ];

  useEffect(() => {
    if (!open) return;

    firstLinkRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      menuButtonRef.current?.focus();
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="nav-shell">
        <NavLink className="brand" to="/" aria-label="Victor Ginelli home">
          <span className="brand-mark">VG</span>
          <span>Victor Ginelli</span>
        </NavLink>
        <nav id={navigationId} className={open ? "primary-nav is-open" : "primary-nav"} aria-label="Primary">
          {nav.map(([label, href], index) => (
            <a ref={index === 0 ? firstLinkRef : undefined} key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
          <a href="mailto:victor@she.energy" onClick={() => setOpen(false)}>Contact</a>
        </nav>
        <div className="nav-actions">
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            className="icon-button menu-button"
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-controls={navigationId}
            aria-expanded={open}
            aria-label="Toggle navigation"
          >
            {open ? <X size={20} weight="bold" aria-hidden /> : <List size={20} weight="bold" aria-hidden />}
          </button>
        </div>
      </div>
    </header>
  );
}
