import { ArrowUpRight } from "@phosphor-icons/react";
import { site } from "~/data/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-callout">Building something ambitious?</p>
        <a className="footer-email" href={`mailto:${site.email}`}>Get in touch <ArrowUpRight size="0.7em" weight="bold" aria-hidden /></a>
      </div>
      <div className="footer-links">
        <a href={site.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={site.resume}>PDF resume</a>
        <span>© {new Date().getFullYear()} Victor Ginelli</span>
      </div>
    </footer>
  );
}
