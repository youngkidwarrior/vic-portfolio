import type { MetaFunction } from "react-router";
import Content from "~/content/shenanigan.mdx";
import { ProjectPage } from "~/components/project-page";
import { projects } from "~/data/site";

const project = projects[1];
export const meta: MetaFunction = () => [{ title: "Shenanigan | Victor Ginelli" }, { name: "description", content: project.lede }];
export default function ShenaniganCaseStudy() { return <ProjectPage project={project} Content={Content} />; }
