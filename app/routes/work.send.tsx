import type { MetaFunction } from "react-router";
import Content from "~/content/send.mdx";
import { ProjectPage } from "~/components/project-page";
import { projects } from "~/data/site";

const project = projects[0];
export const meta: MetaFunction = () => [{ title: "Send | Victor Ginelli" }, { name: "description", content: project.lede }];
export default function SendCaseStudy() { return <ProjectPage project={project} Content={Content} />; }
