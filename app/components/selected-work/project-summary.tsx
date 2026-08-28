import { ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "react-router";
import type { Project } from "~/data/site";

export function ProjectSummary({ project }: { project: Project }) {
  return (
    <div className="project-copy">
      <p className="project-meta">{project.period} / {project.role}</p>
      <h3>{project.title}</h3>
      <p className="project-lede">{project.lede}</p>
      <div className="metric-line" aria-label={`${project.title} highlights`}>
        {project.metrics.map((metric) => (
          <div key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </div>
      <Link className="text-link" to={`/work/${project.slug}`}>
        Read case study <ArrowUpRight size="1em" weight="bold" aria-hidden />
      </Link>
    </div>
  );
}
