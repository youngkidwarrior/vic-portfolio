import * as m from "motion/react-m";
import { useTransform, type AnimationSequence, type MotionValue } from "motion/react";
import { useArtworkPlayback } from "~/components/use-artwork-playback";
import type { ProjectSlug } from "~/data/site";
import "~/styles/project-art.css";

const ease = [0.32, 0.02, 0.2, 1] as const;
// Keep timed transforms native; pointer springs live on the separate parent plane.
const sequences: Record<ProjectSlug, AnimationSequence> = {
  send: [
    [".project-art-one", { transform: ["translateX(-72px)", "translateX(0px)"], opacity: [0.1, 1] }, { at: 0.1, duration: 2.1, ease }],
    [".project-art-two", { transform: ["translateX(64px)", "translateX(0px)"], opacity: [0.1, 1] }, { at: 0.35, duration: 2.1, ease }],
    [".project-art-three", { transform: ["translateX(-88px)", "translateX(0px)"], opacity: [0.1, 1] }, { at: 0.6, duration: 2.1, ease }],
  ],
  shenanigan: [
    [".project-art-one", { transform: ["translateY(64px)", "translateY(0px)"], opacity: [0.1, 1] }, { at: 0.1, duration: 1.9, ease }],
    [".project-art-two", { transform: ["translateY(82px)", "translateY(0px)"], opacity: [0.1, 1] }, { at: 0.4, duration: 1.9, ease }],
    [".project-art-three", { transform: ["translateY(100px)", "translateY(0px)"], opacity: [0.1, 1] }, { at: 0.7, duration: 1.9, ease }],
  ],
  brightid: [
    [".project-art-one", { transform: ["translateX(-68px)", "translateX(0px)"], opacity: [0.1, 1] }, { at: 0.1, duration: 2.2, ease }],
    [".project-art-two", { transform: ["translateY(46px)", "translateY(0px)"], opacity: [0.1, 1] }, { at: 0.3, duration: 2.2, ease }],
    [".project-art-three", { transform: ["translateX(68px)", "translateX(0px)"], opacity: [0.1, 1] }, { at: 0.5, duration: 2.2, ease }],
  ],
  "open-source": [
    [".project-art-one", { transform: ["translateY(-42px) scale(1.16)", "translateY(0px) scale(1)"], opacity: [0.1, 1] }, { at: 0.1, duration: 2.2, ease }],
    [".project-art-two", { transform: ["translateX(-64px) scale(1.16)", "translateX(0px) scale(1)"], opacity: [0.1, 1] }, { at: 0.35, duration: 2.2, ease }],
    [".project-art-three", { transform: ["translateX(64px) scale(1.16)", "translateX(0px) scale(1)"], opacity: [0.1, 1] }, { at: 0.6, duration: 2.2, ease }],
  ],
};

export function ProjectArt({ slug, pointerX, pointerY }: {
  slug: ProjectSlug;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const src = `/images/art/${slug}-poster.webp`;
  const { scope, reducedMotion } = useArtworkPlayback<HTMLDivElement>(src, sequences[slug]);
  const x = useTransform(pointerX, [-1, 1], [-10, 10]);
  const y = useTransform(pointerY, [-1, 1], [-7, 7]);
  return <div className={`project-art project-art-${slug}`} data-artwork={slug}>
    <div ref={scope} className="project-art-window" aria-hidden="true">
      <m.div className="project-art-pointer" style={reducedMotion ? undefined : { x, y }}>
        {(["one", "two", "three"] as const).map(part => <div key={part} data-art-layer className={`project-art-slice project-art-${part}`}>
          <img data-art-media src={src} alt="" width="1120" height="1400" loading="lazy" decoding="async" draggable={false} />
        </div>)}
      </m.div>
    </div>
  </div>;
}
