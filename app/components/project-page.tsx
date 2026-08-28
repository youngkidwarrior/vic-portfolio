import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "react-router";
import type { Project } from "~/data/site";

export function ProjectPage({ project }: { project: Project }) {
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
        </div>
        <figure className="case-screenshot">
          <a
            className="project-image-link"
            href={project.screenshot.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit the website shown for ${project.title}`}
          >
            <img src={project.screenshot.src} alt={project.screenshot.alt} width={project.screenshot.width} height={project.screenshot.height} decoding="async" />
          </a>
          <figcaption>{project.screenshot.caption}</figcaption>
        </figure>
      </header>
      <section className="metric-band page-frame" aria-label="Project outcomes">
        {project.metrics.slice(0, 2).map((metric) => (
          <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>
        ))}
      </section>
      <section className="case-story page-frame">
        <div><h2>The challenge</h2><p>{project.clientStory.challenge}</p></div>
        <div><h2>Victor's contribution</h2><p>{project.clientStory.contribution}</p></div>
        <div><h2>The result</h2><p>{project.clientStory.result}</p></div>
      </section>
      <section className="external-links page-frame">
        <h2>Visit the project</h2>
        <div>
          {project.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} <ArrowUpRight size="1em" weight="bold" aria-hidden /></a>
          ))}
        </div>
      </section>
    </article>
  );
}
