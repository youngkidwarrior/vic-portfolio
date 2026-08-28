import type { MetaFunction } from "react-router";
import { ProjectPage } from "~/components/project-page";
import { projectBySlug } from "~/data/site";
import { createSeoMeta } from "~/utils/seo";

const project = projectBySlug["open-source"];
export const meta: MetaFunction = () => createSeoMeta({
  title: "Open source | Victor Ginelli",
  description: project.lede,
  pathname: "/work/open-source",
  image: { ...project.screenshot, type: "image/jpeg" },
});
export default function OpenSourceCaseStudy() { return <ProjectPage project={project} />; }
