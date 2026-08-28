import type { MetaFunction } from "react-router";
import { ProjectPage } from "~/components/project-page";
import { projectBySlug } from "~/data/site";

const project = projectBySlug.brightid;
export const meta: MetaFunction = () => [{ title: "BrightID Bot | Victor Ginelli" }, { name: "description", content: project.lede }];
export default function BrightIdCaseStudy() { return <ProjectPage project={project} />; }
