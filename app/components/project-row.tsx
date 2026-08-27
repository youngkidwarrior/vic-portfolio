import { ArrowUpRight } from "@phosphor-icons/react";
import { Link } from "react-router";
import { KineticArt } from "~/components/kinetic-art";
import { Reveal } from "~/components/reveal";
import type { Project } from "~/data/site";

export function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal className={`project-row project-${project.accent}`}>
      <div className="project-copy">
        <p className="project-meta">{project.period} / {project.role}</p>
        <h3>{project.title}</h3>
        <p className="project-lede">{project.lede}</p>
        <div className="metric-line" aria-label={`${project.title} highlights`}>
          {project.metrics.map((metric) => (
            <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>
          ))}
        </div>
        <Link className="text-link" to={`/work/${project.slug}`}>Read case study <ArrowUpRight size="1em" weight="bold" aria-hidden /></Link>
      </div>
      <KineticArt src={project.art} alt={project.artAlt} className={index % 2 ? "art-shift" : ""} />
    </Reveal>
  );
}
