import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";
import * as m from "motion/react-m";
import { useAnimate, useMotionValue, useScroll, useSpring, useTransform, stagger } from "motion/react";
import { useEffect } from "react";
import { useLinkClickHandler, useLocation } from "react-router";
import { editorialEase, useMotionSettings } from "~/components/motion-system";
import { KineticLink } from "~/components/kinetic-link";
import { HeroArt } from "~/components/hero-art";
import "~/styles/hero-art.css";

export function Hero() {
  const { search } = useLocation();
  const openResume = useLinkClickHandler("/resume");
  const openHighlights = useLinkClickHandler({ pathname: "/", search, hash: "#work" });
  const [section, animate] = useAnimate<HTMLElement>();
  const { reducedMotion, finePointer } = useMotionSettings();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 110, damping: 22 });
  const y = useSpring(pointerY, { stiffness: 110, damping: 22 });
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const blueX = useTransform(() => x.get() * 22 + scrollYProgress.get() * 10);
  const blueY = useTransform(() => y.get() * 14 - scrollYProgress.get() * 22);
  const redX = useTransform(() => x.get() * -14 - scrollYProgress.get() * 8);
  const redY = useTransform(() => y.get() * -10 + scrollYProgress.get() * 16);

  useEffect(() => {
    if (!reducedMotion) return;
    pointerX.set(0);
    pointerY.set(0);
    x.jump(0);
    y.jump(0);
  }, [reducedMotion, pointerX, pointerY, x, y]);

  useEffect(() => {
    if (reducedMotion) return;
    // Text stays readable while the artwork runs its own visible entrance.
    const entrance = animate([
      ["[data-hero-line]", { y: [18, 0] }, { at: 0.08, duration: 0.8, delay: stagger(0.065), ease: editorialEase }],
      ["[data-hero-rule]", { scaleX: [0.35, 1] }, { at: 0.12, duration: 0.9, ease: editorialEase }],
    ]);
    return () => {
      entrance.stop();
      section.current?.querySelectorAll<HTMLElement>("[data-hero-line], [data-hero-rule]").forEach((element) => {
        element.style.removeProperty("transform");
      });
    };
  }, [animate, reducedMotion, section]);

  function reset() { pointerX.set(0); pointerY.set(0); }

  return (
    <section
      ref={section}
      className="hero page-frame"
      id="about"
      onPointerMove={(event) => {
        if (reducedMotion || !finePointer || event.pointerType === "touch") return;
        const box = event.currentTarget.getBoundingClientRect();
        pointerX.set(Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1)));
        pointerY.set(Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1)));
      }}
      onPointerLeave={reset}
    >
      <div className="hero-copy">
        <p className="mono-label" data-hero-line>About</p>
        <h1 data-hero-line>Victor Ginelli</h1>
        <p className="hero-role" data-hero-line>Founder and full-stack product engineer.</p>
        <p className="hero-subhead" data-hero-line>I’ve spent the last eight years building across the stack, turning ambitious ideas into products people can actually use.</p>
        <div className="hero-actions" data-hero-line>
          <KineticLink className="button button-primary" href="/resume" onClick={openResume}>View résumé <ArrowUpRight size="1em" weight="bold" aria-hidden /></KineticLink>
          <KineticLink className="button button-secondary" href="#work" onClick={openHighlights}>See highlights <ArrowDownRight size="1em" weight="bold" aria-hidden /></KineticLink>
        </div>
      </div>
      <figure className="portrait-frame hero-portrait">
        <span className="hero-portrait-rule" data-hero-rule aria-hidden="true" />
        <div className="portrait-stage">
          <m.span aria-hidden className="portrait-ink portrait-ink-blue" style={reducedMotion ? undefined : { x: blueX, y: blueY }} />
          <m.span aria-hidden className="portrait-ink portrait-ink-red" style={reducedMotion ? undefined : { x: redX, y: redY }} />
          <img src="/images/victor-portrait.webp" alt="Portrait of Victor Ginelli" width="800" height="786" decoding="async" fetchPriority="high" />
        </div>
        <figcaption>Victor Ginelli</figcaption>
      </figure>
      <div className="hero-art-scene" data-artwork="hero">
        <div className="hero-art-plane"><HeroArt /></div>
      </div>
    </section>
  );
}
