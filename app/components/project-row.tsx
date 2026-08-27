import { Reveal } from "~/components/reveal";
import { SelectedWorkComposition } from "~/components/selected-work/selected-work-composition";
import type { Project } from "~/data/site";

export function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal className={`project-row project-${project.accent}`}>
      <SelectedWorkComposition project={project} sequence={index + 1} />
    </Reveal>
  );
}
