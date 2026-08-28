import { ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "react-router";
import type { Project } from "~/data/site";

export function SelectedWorkComposition({ project, priority }: { project: Project; priority: boolean }) {
  return (
    <article className="simple-project" data-composition="project-showcase">
      <figure className="project-screenshot">
        <a
          className="project-image-link"
          href={project.screenshot.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Visit the website shown for ${project.title}`}
        >
          <img
            src={project.screenshot.src}
            alt={project.screenshot.alt}
            width={project.screenshot.width}
            height={project.screenshot.height}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        </a>
        <figcaption>{project.screenshot.caption}</figcaption>
      </figure>
      <div className="project-copy">
        <p className="mono-label">{project.period} / {project.role}</p>
        <h3>{project.title}</h3>
        <p className="project-lede">{project.lede}</p>
        <div className="metric-line">
          {project.metrics.slice(0, 2).map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
        </div>
        <div className="simple-project-actions">
          <a className="text-link" aria-label={`Visit ${project.title}`} href={project.links[0].href} target="_blank" rel="noreferrer">Visit project <ArrowUpRight size="1em" weight="bold" aria-hidden /></a>
          <Link className="text-link" to={`/work/${project.slug}`}>Read the story</Link>
        </div>
      </div>
    </article>
  );
}
