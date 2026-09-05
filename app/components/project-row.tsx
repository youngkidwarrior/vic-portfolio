import { ArrowUpRight } from "@phosphor-icons/react";
import * as m from "motion/react-m";
import { useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, type PointerEvent } from "react";
import { Link } from "react-router";
import { Reveal } from "~/components/reveal";
import { ProjectArt } from "~/components/project-art";
import { useProjectTransition } from "~/components/project-transition";
import { useMotionSettings } from "~/components/motion-system";
import type { Project } from "~/data/site";

export function ProjectRow({ project }: { project: Project }) {
  const transition = useProjectTransition(project.slug);
  const row = useRef<HTMLDivElement>(null);
  const { reducedMotion, finePointer } = useMotionSettings();
  const { scrollYProgress } = useScroll({ target: row, offset: ["start end", "end start"] });
  const ruleScale = useTransform(scrollYProgress, [0, 0.25, 1], [0.12, 1, 1]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const inkX = useSpring(pointerX, { stiffness: 130, damping: 24 });
  const inkY = useSpring(pointerY, { stiffness: 130, damping: 24 });

  useEffect(() => {
    if (!reducedMotion && finePointer) return;
    pointerX.set(0);
    pointerY.set(0);
    inkX.jump(0);
    inkY.jump(0);
  }, [finePointer, inkX, inkY, pointerX, pointerY, reducedMotion]);

  function followPointer(event: PointerEvent<HTMLElement>) {
    if (reducedMotion || !finePointer || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2)));
    pointerY.set(Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2)));
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div ref={row} className={`project-row project-${project.accent}`}>
      <m.span aria-hidden className="project-rule" style={reducedMotion ? undefined : { scaleX: ruleScale }} />
      <m.article
        className="simple-project"
        data-composition="project-showcase"
        initial={false}
        whileHover={!reducedMotion && finePointer ? "active" : undefined}
        animate="rest"
        onPointerMove={followPointer}
        onPointerLeave={resetPointer}
        onPointerCancel={resetPointer}
      >
        <Reveal className="project-visual">
          <figure className="project-screenshot">
            <span aria-hidden className="project-transition-frame" style={transition.frameStyle} />
            <div className="project-media">
              <ProjectArt slug={project.slug} pointerX={inkX} pointerY={inkY} />
              <a
                className="project-image-link"
                href={project.screenshot.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit the website shown for ${project.title}`}
              >
                <img style={transition.imageStyle} src={project.screenshot.src} alt={project.screenshot.alt} width={project.screenshot.width} height={project.screenshot.height} loading="lazy" decoding="async" />
              </a>
            </div>
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
            <Link className="text-link" {...transition.detailsLinkProps}>Project details <ArrowUpRight size="1em" weight="bold" aria-hidden /></Link>
          </div>
        </Reveal>
      </m.article>
    </div>
  );
}
