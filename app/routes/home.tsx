import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { MetaFunction } from "react-router";
import { KineticArt } from "~/components/kinetic-art";
import { ProjectRow } from "~/components/project-row";
import { Reveal } from "~/components/reveal";
import { projects, site, skills } from "~/data/site";

export const meta: MetaFunction = () => [
  { title: "Victor Ginelli | Founding product engineer" },
  { name: "description", content: site.description },
];

export default function Home() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const ruleX = useTransform(scrollYProgress, [0, 1], ["-35%", "35%"]);

  return (
    <>
      <section className="hero page-frame">
        <div className="hero-copy">
          <p className="mono-label">Founding product engineer</p>
          <h1><span>I turn hard systems</span><span>into usable products.</span></h1>
          <p className="hero-subhead">{site.description}</p>
          <div className="hero-actions">
            <a className="button button-primary" href={`mailto:${site.email}`}>Start a conversation <ArrowUpRight size="1em" weight="bold" aria-hidden /></a>
            <a className="button button-secondary" href="#work">View work <ArrowDownRight size="1em" weight="bold" aria-hidden /></a>
          </div>
        </div>
        <KineticArt src="/images/hero-poster.webp" alt="Original abstract artwork showing many complex paths becoming one product flow" className="hero-art" />
        <motion.div className="hero-rule" style={reduced ? undefined : { x: ruleX }} aria-hidden />
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
          <p className="mono-label">Recognition</p>
          <h2>Winner, Aragon Hack for Freedom</h2>
          <p>Built a decentralized application with Solidity, React, and Aragon OS. An early signal of the work that followed: technical range put in service of a usable product.</p>
        </Reveal>
        <div className="recognition-mark" aria-hidden><span>HACK</span><strong>→</strong><span>SHIP</span></div>
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
        <a className="button button-primary" href={`mailto:${site.email}`}>Start a conversation <ArrowUpRight size="1em" weight="bold" aria-hidden /></a>
      </section>
    </>
  );
}
