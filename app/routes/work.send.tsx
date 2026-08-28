import type { MetaFunction } from "react-router";
import { ProjectPage } from "~/components/project-page";
import { projectBySlug } from "~/data/site";
import { createSeoMeta } from "~/utils/seo";

const project = projectBySlug.send;
export const meta: MetaFunction = () => createSeoMeta({
  title: "Send | Victor Ginelli",
  description: project.lede,
  pathname: "/work/send",
  image: { ...project.screenshot, type: "image/jpeg" },
});
export default function SendCaseStudy() { return <ProjectPage project={project} />; }
