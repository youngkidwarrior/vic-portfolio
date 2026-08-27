import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
import type { MetaFunction } from "react-router";
import { site } from "~/data/site";

export const meta: MetaFunction = () => [
  { title: "Resume | Victor Ginelli" },
  { name: "description", content: "Victor Ginelli’s experience across payments, identity, mobile, infrastructure, and onchain products." },
];

const roles = [
  {
    company: "Send",
    role: "Senior full-stack engineer",
    period: "Jan 2023–Aug 2026",
    bullets: [
      "Led a passkey-secured virtual debit card from architecture through launch, spanning wallet ownership, KYC, issuance, funding, 3DS, lifecycle controls, webhooks, and durable workflows.",
      "Architected activity scoring and token distribution that delivered 81M+ SEND by July 2026, equal to 27% of the community allocation and approximately $1.46M at the published reference price.",
      "Helped move Send from a PWA to native apps on a shared TypeScript foundation, supporting 15 public iOS releases, 1K+ Android downloads, 70K+ passkeys, and 20K Sendtags.",
      "Migrated payment execution to Temporal workflows for a platform with $53M+ in onchain transfer volume.",
    ],
  },
  {
    company: "Shenanigan Tech LLC",
    role: "Founder and technical lead",
    period: "2018–2023",
    bullets: [
      "Founded and bootstrapped a cryptocurrency startup, raised $100K+ through community support, and led six recurring contributors and two contractors.",
      "Created PANTS, a community fundraising and token-reward mechanism that extended operating runway by 12 months.",
      "Designed decentralized governance and contribution systems that rewarded measurable participation.",
    ],
  },
  {
    company: "BrightID Discord Bot",
    role: "Project lead",
    period: "2020–2023",
    bullets: [
      "Took an identity-verification bot from hackathon prototype to a production service that verified 11,000+ people in one year.",
      "Migrated deployment from Heroku to Railway and operated a dedicated BrightID node.",
    ],
  },
  {
    company: "Ethereum and DAO ecosystem",
    role: "Selected open-source contributor",
    period: "2018–2023",
    bullets: [
      "Shipped React, Solidity, payment, and identity improvements across SourceCred, Honeyswap, BrightID, and Colony.",
    ],
  },
];

export default function Resume() {
  return (
    <article className="resume-page page-frame">
      <header className="resume-header">
        <div>
          <p className="mono-label">Resume</p>
          <h1>Victor Ginelli</h1>
          <p>Founder and full-stack product engineer</p>
        </div>
        <a className="button button-primary" href={site.resume} download>Download PDF <ArrowDown size="1em" weight="bold" aria-hidden /></a>
      </header>

      <section className="resume-summary">
        <h2>Profile</h2>
        <p>Founder and senior full-stack engineer with 8+ years building consumer payments, identity, blockchain, and community products across web, mobile, backend, data, infrastructure, and smart contracts. Hands-on product leader who has built teams of up to eight and taken complex systems from concept to production.</p>
      </section>

      <section className="resume-experience">
        <h2>Experience</h2>
        {roles.map((role) => (
          <article className="resume-role" key={role.company}>
            <header><div><h3>{role.company}</h3><p>{role.role}</p></div><time>{role.period}</time></header>
            <ul>{role.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
          </article>
        ))}
      </section>

      <section className="resume-columns">
        <div>
          <h2>Technical range</h2>
          <p><strong>Languages</strong><br />TypeScript, JavaScript, SQL, Solidity, Bash</p>
          <p><strong>Web and mobile</strong><br />React, React Native, Expo, Next.js, Tamagui, tRPC, Zod, TanStack Query</p>
          <p><strong>Systems and data</strong><br />Node.js, Bun, Temporal, PostgreSQL, Supabase, Docker, Kubernetes, Tilt</p>
          <p><strong>Blockchain and quality</strong><br />WebAuthn, passkeys, ERC-4337, Viem, Wagmi, Foundry, Jest, Playwright, Storybook, OpenTelemetry, PostHog</p>
        </div>
        <div>
          <h2>Recognition</h2>
          <p><strong>Winner, Aragon Hack for Freedom</strong><br />Built a decentralized application using Solidity, React, and Aragon OS.</p>
          <h2>Education</h2>
          <p><strong>Claremont McKenna College</strong><br />Physics and Computer Science, 2018</p>
          <h2>Connect</h2>
          <p><a className="text-link" href={`mailto:${site.email}`}>{site.email} <ArrowUpRight size="1em" weight="bold" aria-hidden /></a></p>
          <p><a className="text-link" href={site.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size="1em" weight="bold" aria-hidden /></a></p>
        </div>
      </section>
    </article>
  );
}
