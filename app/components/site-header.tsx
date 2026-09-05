import { List, X } from "@phosphor-icons/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { ThemeToggle } from "~/components/theme-toggle";
import { useMotionSettings } from "~/components/motion-system";

const navigationId = "primary-navigation";

export function SiteHeader() {
  const { pathname, search } = useLocation();
  const { reducedMotion } = useMotionSettings();
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
      <Link
        className="skip-link"
        to={{ pathname, search, hash: "#main-content" }}
        onClick={(event) => {
          if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
            document.getElementById("main-content")?.focus({ preventScroll: true });
          }
        }}
      >Skip to content</Link>
      <div className="nav-shell">
        <NavLink className="brand" to="/" aria-label="VG, Victor Ginelli home">
          <span className="brand-mark">VG</span>
          <span>Victor Ginelli</span>
        </NavLink>
        <nav id={navigationId} className={open ? "primary-nav is-open" : "primary-nav"} aria-label="Primary">
          {nav.map(([label, href], index) => (
            <Link ref={index === 0 ? firstLinkRef : undefined} key={href} to={href} onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <a href="mailto:victor@she.energy" onClick={() => setOpen(false)}>Contact</a>
        </nav>
        <div className="nav-actions">
          <ThemeToggle />
          <m.button
            ref={menuButtonRef}
            className="icon-button menu-button"
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-controls={navigationId}
            aria-expanded={open}
            aria-label="Toggle navigation"
            whileTap={reducedMotion ? undefined : { scale: 0.9 }}
          >
            {open ? <X size={20} weight="bold" aria-hidden /> : <List size={20} weight="bold" aria-hidden />}
          </m.button>
        </div>
      </div>
    </header>
  );
}
