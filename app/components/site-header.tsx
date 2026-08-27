import { List, X } from "@phosphor-icons/react";
import { useState } from "react";
import { NavLink } from "react-router";
import { ThemeToggle } from "~/components/theme-toggle";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const nav = [
    ["Work", "/#work"],
    ["About", "/#about"],
    ["Resume", "/resume"],
  ];

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="nav-shell">
        <NavLink className="brand" to="/" aria-label="Victor Ginelli home">
          <span className="brand-mark">VG</span>
          <span>Victor Ginelli</span>
        </NavLink>
        <nav className={open ? "primary-nav is-open" : "primary-nav"} aria-label="Primary">
          {nav.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
          <a href="mailto:victor@she.energy" onClick={() => setOpen(false)}>Contact</a>
        </nav>
        <div className="nav-actions">
          <ThemeToggle />
          <button className="icon-button menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">
            {open ? <X size={20} weight="bold" aria-hidden /> : <List size={20} weight="bold" aria-hidden />}
          </button>
        </div>
      </div>
    </header>
  );
}
