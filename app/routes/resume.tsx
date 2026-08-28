import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
import type { MetaFunction } from "react-router";
import { resumeContent } from "~/data/resume";
import { site } from "~/data/site";
import { createSeoMeta } from "~/utils/seo";

export const meta: MetaFunction = () => createSeoMeta({
  title: "Resume | Victor Ginelli",
  description: resumeContent.profile,
  pathname: "/resume",
});

export default function Resume() {
  return (
    <article className="resume-page page-frame">
      <header className="resume-header">
        <div>
          <h1>{resumeContent.name}</h1>
          <p>{resumeContent.title}</p>
        </div>
        <a className="button button-primary" href={site.resume} download>Download PDF <ArrowDown size="1em" weight="bold" aria-hidden /></a>
      </header>

      <section className="resume-summary">
        <h2>Profile</h2>
        <p>{resumeContent.profile}</p>
      </section>

      <section className="resume-experience">
        <h2>Experience</h2>
        {resumeContent.experience.map((experience) => (
          <article className="resume-role" key={experience.company}>
            <header><div><h3>{experience.company}</h3><p>{experience.role}</p></div><time>{experience.period}</time></header>
            <ul>{experience.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
          </article>
        ))}
      </section>

      <section className="resume-columns">
        <div>
          <h2>Technical range</h2>
          {resumeContent.skills.map((skill) => (
            <p key={skill.label}><strong>{skill.label}</strong><br />{skill.items}</p>
          ))}
        </div>
        <div>
          <h2>Recognition</h2>
          <p><strong>{resumeContent.recognition.title}</strong><br />{resumeContent.recognition.detail}</p>
          <h2>Education</h2>
          <p><strong>{resumeContent.education.school}</strong><br />{resumeContent.education.detail}</p>
          <h2>Connect</h2>
          <p>{resumeContent.location}</p>
          <p><a className="text-link" href={`mailto:${resumeContent.email}`}>{resumeContent.email} <ArrowUpRight size="1em" weight="bold" aria-hidden /></a></p>
          <p><a className="text-link" href={site.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size="1em" weight="bold" aria-hidden /></a></p>
        </div>
      </section>
    </article>
  );
}
