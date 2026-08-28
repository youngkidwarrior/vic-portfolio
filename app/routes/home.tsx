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
      <section className="hero page-frame">
        <div className="hero-copy">
          <p className="mono-label">Product engineer and founder</p>
          <h1>I make complex products feel simple.</h1>
          <p className="hero-subhead">I design and build payments, identity, and mobile products from first idea to launch.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">View my work <ArrowDownRight size="1em" weight="bold" aria-hidden /></a>
            <a className="button button-secondary" href={`mailto:${site.email}`}>Start a conversation <ArrowUpRight size="1em" weight="bold" aria-hidden /></a>
          </div>
        </div>
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

      <section className="about-section page-frame" id="about">
        <Reveal className="about-copy">
          <p className="mono-label">About</p>
          <h2>Product judgment, visual taste, and technical depth.</h2>
          <p>Victor is a founder and product engineer who works across design, frontend, and systems. He turns complex ideas into clear, polished products people can trust.</p>
          <a className="text-link" href="/resume">Read Victor's resume <ArrowUpRight size="1em" weight="bold" aria-hidden /></a>
        </Reveal>
        <figure className="portrait-frame">
          <img src="/images/victor-portrait.webp" alt="Portrait of Victor Ginelli" width="800" height="786" decoding="async" />
          <figcaption>Victor Ginelli</figcaption>
        </figure>
      </section>
    </>
  );
}
