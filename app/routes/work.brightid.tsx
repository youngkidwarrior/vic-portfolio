import type { MetaFunction } from "react-router";
import { ProjectPage } from "~/components/project-page";
import { projectBySlug } from "~/data/site";
import { createSeoMeta } from "~/utils/seo";

const project = projectBySlug.brightid;
export const meta: MetaFunction = () => createSeoMeta({
  title: "BrightID Bot | Victor Ginelli",
  description: project.lede,
  pathname: "/work/brightid",
  image: { ...project.screenshot, type: "image/jpeg" },
});
export default function BrightIdCaseStudy() { return <ProjectPage project={project} />; }
