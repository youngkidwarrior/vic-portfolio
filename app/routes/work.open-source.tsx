import type { MetaFunction } from "react-router";
import Content from "~/content/open-source.mdx";
import { ProjectPage } from "~/components/project-page";
import { projects } from "~/data/site";

const project = projects[3];
export const meta: MetaFunction = () => [{ title: "Open source | Victor Ginelli" }, { name: "description", content: project.lede }];
export default function OpenSourceCaseStudy() { return <ProjectPage project={project} Content={Content} />; }
