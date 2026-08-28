import type { MetaFunction } from "react-router";
import { ProjectPage } from "~/components/project-page";
import { projectBySlug } from "~/data/site";
import { createSeoMeta } from "~/utils/seo";

const project = projectBySlug.shenanigan;
export const meta: MetaFunction = () => createSeoMeta({
  title: "Shenanigan | Victor Ginelli",
  description: project.lede,
  pathname: "/work/shenanigan",
  image: { ...project.screenshot, type: "image/jpeg" },
});
export default function ShenaniganCaseStudy() { return <ProjectPage project={project} />; }
