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
        <ul className="project-contributions" aria-label={`${project.title} scope of work`}>
          {project.contributions.map((contribution) => (
            <li key={contribution.title}>{contribution.title}</li>
          ))}
        </ul>
        <div className="simple-project-actions">
          <Link className="text-link" to={`/work/${project.slug}`}>Project details</Link>
        </div>
      </div>
    </article>
  );
}
