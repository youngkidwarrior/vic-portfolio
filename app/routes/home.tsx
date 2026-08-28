import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import type { MetaFunction } from "react-router";
import { ProjectRow } from "~/components/project-row";
import { Reveal } from "~/components/reveal";
import { projects, recognition, site } from "~/data/site";

export const meta: MetaFunction = () => [
  { title: "Victor Ginelli | Founding product engineer" },
  { name: "description", content: site.description },
];

export default function Home() {
  return (
    <>
      <section className="hero page-frame" id="about">
        <div className="hero-copy">
          <p className="mono-label">About</p>
          <h1>Victor Ginelli</h1>
          <p className="hero-role">Founder and product engineer.</p>
          <p className="hero-subhead">Victor brings design and engineering together to make ambitious ideas clear, useful, and real.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="/resume">Read Victor's resume <ArrowUpRight size="1em" weight="bold" aria-hidden /></a>
            <a className="button button-secondary" href="#work">View selected work <ArrowDownRight size="1em" weight="bold" aria-hidden /></a>
          </div>
        </div>
        <figure className="portrait-frame hero-portrait">
          <img src="/images/victor-portrait.webp" alt="Portrait of Victor Ginelli" width="800" height="786" decoding="async" />
          <figcaption>Victor Ginelli</figcaption>
        </figure>
      </section>

      <section className="work-section page-frame" id="work">
        <Reveal className="section-intro">
          <p className="mono-label">Selected work</p>
          <h2>Four products, clearly told.</h2>
        </Reveal>
        <div className="project-list">
          {projects.map((project, index) => <ProjectRow key={project.slug} project={project} index={index} />)}
        </div>
      </section>

      <section className="recognition-section recognition-compact page-frame">
        <Reveal className="recognition-copy">
          <p className="mono-label">Recognition</p>
          <h2>{recognition.headline}</h2>
          <p>Built NFT Request, a decentralized request-and-payment product.</p>
          <a className="text-link" href={recognition.supportingProof[0].source} target="_blank" rel="noreferrer">View the project <ArrowUpRight size="1em" weight="bold" aria-hidden /></a>
        </Reveal>
      </section>

    </>
  );
}
