import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import type { MetaFunction } from "react-router";
import { AtmosphericArt } from "~/components/atmospheric-art";
import { ProductProof } from "~/components/product-proof";
import { ProjectRow } from "~/components/project-row";
import { RecognitionDossier } from "~/components/recognition-dossier";
import { Reveal } from "~/components/reveal";
import { projects, recognition, site, skills } from "~/data/site";

export const meta: MetaFunction = () => [
  { title: "Victor Ginelli | Founding product engineer" },
  { name: "description", content: site.description },
];

export default function Home() {
  const leadProject = projects[0];

  return (
    <>
      <section className="hero page-frame">
        <div className="hero-copy">
          <p className="mono-label">Founding product engineer</p>
          <h1><span>I turn hard systems</span><span>into usable products.</span></h1>
          <p className="hero-subhead">{site.description}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">View selected work <ArrowDownRight size="1em" weight="bold" aria-hidden /></a>
            <a className="button button-secondary" href="/resume">Read resume <ArrowUpRight size="1em" weight="bold" aria-hidden /></a>
          </div>
        </div>
        <div className="hero-proof-stage">
          <AtmosphericArt asset={leadProject.decorativeArt} className="hero-atmosphere" />
          <ProductProof asset={leadProject.heroAsset} priority className="hero-product-proof" />
        </div>
      </section>

      <section className="signal-band page-frame" aria-label="Practice areas">
        <span>Payments</span><span>Identity</span><span>Mobile</span><span>Infrastructure</span><span>Onchain systems</span>
      </section>

      <section className="work-section page-frame" id="work">
        <Reveal className="section-intro">
          <p className="mono-label">Selected work</p>
          <h2>Products that carry their complexity quietly.</h2>
        </Reveal>
        <div className="project-list">
          {projects.map((project, index) => <ProjectRow key={project.slug} project={project} index={index} />)}
        </div>
      </section>

      <section className="systems-section page-frame" id="systems">
        <Reveal className="systems-heading">
          <h2>One product mind, across the stack.</h2>
          <p>Victor works from the customer interaction down to the trust and operations layers that make it dependable.</p>
        </Reveal>
        <div className="system-map">
          {skills.map(([label, ...items]) => (
            <Reveal className="system-row" key={label}>
              <strong>{label}</strong>
              <div>{items.map((item) => <span key={item}>{item}</span>)}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="recognition-section page-frame">
        <Reveal className="recognition-copy">
          <h2>{recognition.headline}</h2>
          <p>{recognition.summary}</p>
          <p className="recognition-attestation">Owner-attested result · documentary proof reserved</p>
        </Reveal>
        <RecognitionDossier recognition={recognition} />
      </section>

      <section className="about-section page-frame" id="about">
        <Reveal className="about-copy">
          <h2>Founder instincts. Product taste. Engineering depth.</h2>
          <p>Victor Ginelli is a product engineer who has founded a company, built teams, and shipped consumer systems across payments, identity, mobile, infrastructure, and smart contracts.</p>
          <p>He studied physics and computer science at Claremont McKenna College. Away from the code, he still thinks in motion: how energy moves, where friction appears, and what makes a system feel natural.</p>
          <a className="text-link" href="/resume">Read the full resume <ArrowUpRight size="1em" weight="bold" aria-hidden /></a>
        </Reveal>
        <figure className="portrait-frame">
          <img src="/images/victor-portrait.webp" alt="Portrait of Victor Ginelli" width="800" height="786" decoding="async" />
          <figcaption>Victor Ginelli</figcaption>
        </figure>
      </section>

      <section className="availability page-frame">
        <p>{site.availability}</p>
      </section>
    </>
  );
}
