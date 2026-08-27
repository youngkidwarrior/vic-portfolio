import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import type { ComponentType } from "react";
import { Link } from "react-router";
import { KineticArt } from "~/components/kinetic-art";
import { Reveal } from "~/components/reveal";
import type { Project } from "~/data/site";

export function ProjectPage({ project, Content }: { project: Project; Content: ComponentType }) {
  return (
    <article className={`case-study project-${project.accent}`}>
      <header className="case-hero page-frame">
        <Link className="back-link" to="/#work"><ArrowLeft size="1em" weight="bold" aria-hidden /> All work</Link>
        <div className="case-title-grid">
          <div>
            <p className="mono-label">{project.period} / {project.role}</p>
            <h1>{project.title}</h1>
            <p className="case-lede">{project.lede}</p>
          </div>
          <p className="case-summary">{project.summary}</p>
        </div>
        <KineticArt src={project.art} alt={project.artAlt} className="case-art" />
      </header>
      <section className="metric-band page-frame" aria-label="Project outcomes">
        {project.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
      </section>
      <Reveal className="case-body page-frame prose"><Content /></Reveal>
      <section className="external-links page-frame">
        <h2>Continue exploring</h2>
        <div>{project.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} <ArrowUpRight size="1em" weight="bold" aria-hidden /></a>)}</div>
      </section>
    </article>
  );
}
