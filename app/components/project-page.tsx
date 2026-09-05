import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "react-router";
import { useProjectTransition } from "~/components/project-transition";
import type { Project } from "~/data/site";

export function ProjectPage({ project }: { project: Project }) {
  const transition = useProjectTransition(project.slug);
  return (
    <article className={`case-study project-${project.accent}`}>
      <header className="case-hero page-frame">
        <Link className="back-link" {...transition.backLinkProps}><ArrowLeft size="1em" weight="bold" aria-hidden /> All work</Link>
        <div className="case-title-grid">
          <div>
            <p className="mono-label">{project.period} / {project.role}</p>
            <h1>{project.title}</h1>
            <p className="case-lede">{project.lede}</p>
          </div>
        </div>
        <figure className="case-screenshot">
          <span aria-hidden className="project-transition-frame" style={transition.frameStyle} />
          <a
            className="project-image-link"
            href={project.screenshot.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit the website shown for ${project.title}`}
          >
            <img style={transition.imageStyle} src={project.screenshot.src} alt={project.screenshot.alt} width={project.screenshot.width} height={project.screenshot.height} decoding="async" />
          </a>
          <figcaption>{project.screenshot.caption}</figcaption>
        </figure>
      </header>
      <section className="contribution-section page-frame">
        <header className="contribution-heading">
          <h2>What Victor built</h2>
        </header>
        <ul className="contribution-list">
          {project.contributions.map((contribution) => (
            <li key={contribution.title}>
              <h3>{contribution.title}</h3>
              <p>{contribution.detail}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="external-links page-frame">
        <h2>Project links</h2>
        <div>
          {project.links.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label} <ArrowUpRight size="1em" weight="bold" aria-hidden /></a>
          ))}
        </div>
      </section>
    </article>
  );
}
