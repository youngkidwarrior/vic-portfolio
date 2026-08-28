import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import type { MetaFunction } from "react-router";
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
      <section className="hero page-frame" id="about">
        <div className="hero-copy">
          <p className="mono-label">About</p>
          <h1>Victor Ginelli</h1>
          <p className="hero-role">Founder and full-stack product engineer.</p>
          <p className="hero-subhead">I’ve spent the last eight years building across the stack, turning ambitious ideas into products people can actually use.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="/resume">View résumé <ArrowUpRight size="1em" weight="bold" aria-hidden /></a>
            <a className="button button-secondary" href="#work">See highlights <ArrowDownRight size="1em" weight="bold" aria-hidden /></a>
          </div>
        </div>
        <figure className="portrait-frame hero-portrait">
          <img src="/images/victor-portrait.webp" alt="Portrait of Victor Ginelli" width="800" height="786" decoding="async" />
          <figcaption>Victor Ginelli</figcaption>
        </figure>
      </section>

      <section className="work-section page-frame" id="work">
        <Reveal className="section-intro">
          <h2>My recent highlights</h2>
        </Reveal>
        <div className="project-list">
          {projects.map((project, index) => <ProjectRow key={project.slug} project={project} priority={index === 0} />)}
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
