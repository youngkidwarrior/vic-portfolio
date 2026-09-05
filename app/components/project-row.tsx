import { ArrowUpRight } from "@phosphor-icons/react";
import * as m from "motion/react-m";
import { useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Link } from "react-router";
import { Reveal } from "~/components/reveal";
import { useMotionSettings } from "~/components/motion-system";
import type { Project } from "~/data/site";

export function ProjectRow({ project }: { project: Project }) {
  const row = useRef<HTMLDivElement>(null);
  const { reducedMotion, finePointer } = useMotionSettings();
  const { scrollYProgress } = useScroll({ target: row, offset: ["start end", "end start"] });
  const ruleScale = useTransform(scrollYProgress, [0, 0.25, 1], [0.12, 1, 1]);
  return (
    <div ref={row} className={`project-row project-${project.accent}`}>
      <m.span aria-hidden className="project-rule" style={reducedMotion ? undefined : { scaleX: ruleScale }} />
      <m.article
        className="simple-project"
        data-composition="project-showcase"
        initial={false}
        whileHover={!reducedMotion && finePointer ? "active" : undefined}
        animate="rest"
      >
        <Reveal className="project-visual">
          <figure className="project-screenshot">
            <a
              className="project-image-link"
              href={project.screenshot.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit the website shown for ${project.title}`}
            >
              <img src={project.screenshot.src} alt={project.screenshot.alt} width={project.screenshot.width} height={project.screenshot.height} loading="lazy" decoding="async" />
            </a>
            <figcaption>{project.screenshot.caption}</figcaption>
          </figure>
        </Reveal>
        <Reveal className="project-copy" delay={0.09}>
          <p className="mono-label">{project.period} / {project.role}</p>
          <m.h3 variants={{ rest: { x: 0 }, active: { x: 7 } }}>{project.title}</m.h3>
          <p className="project-lede">{project.lede}</p>
          <ul className="project-contributions" aria-label={`${project.title} scope of work`}>
            {project.contributions.map((contribution) => <li key={contribution.title}>{contribution.title}</li>)}
          </ul>
          <div className="simple-project-actions">
            <Link className="text-link" to={`/work/${project.slug}`}>Project details <ArrowUpRight size="1em" weight="bold" aria-hidden /></Link>
          </div>
        </Reveal>
      </m.article>
    </div>
  );
}
