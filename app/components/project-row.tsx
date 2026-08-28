import { Reveal } from "~/components/reveal";
import { SelectedWorkComposition } from "~/components/selected-work/selected-work-composition";
import type { Project } from "~/data/site";

export function ProjectRow({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <Reveal className={`project-row project-${project.accent}`}>
      <SelectedWorkComposition project={project} priority={priority} />
    </Reveal>
  );
}
