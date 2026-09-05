import { ArrowUpRight } from "@phosphor-icons/react";
import type { MetaFunction } from "react-router";
import { Hero } from "~/components/hero";
import { ProjectRow } from "~/components/project-row";
import { Reveal } from "~/components/reveal";
import { projects, recognition, site } from "~/data/site";
import { createSeoMeta } from "~/utils/seo";

export const meta: MetaFunction = () => createSeoMeta({
  title: "Victor Ginelli | Founder and full-stack product engineer",
  description: site.description,
  pathname: "/",
});

export default function Home() {
  return (
    <>
      <Hero />

      <section className="work-section page-frame" id="work">
        <Reveal className="section-intro">
          <h2>My recent highlights</h2>
        </Reveal>
        <div className="project-list">
          {projects.map((project) => <ProjectRow key={project.slug} project={project} />)}
        </div>
      </section>

      <section className="recognition-section recognition-compact page-frame">
        <Reveal className="recognition-copy">
          <p className="mono-label">Recognition</p>
          <h2>{recognition.headline}</h2>
          <p>Built NFT Request, a hackathon prototype that let people browse NFTs held by an Aragon DAO, make token-backed offers, and complete approved exchanges through the DAO’s existing governance process.</p>
          <a className="text-link" href={recognition.supportingProof[0].source} target="_blank" rel="noreferrer">View the project <ArrowUpRight size="1em" weight="bold" aria-hidden /></a>
        </Reveal>
      </section>

    </>
  );
}
