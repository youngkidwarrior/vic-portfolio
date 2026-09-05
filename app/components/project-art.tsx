import * as m from "motion/react-m";
import { useTransform, type AnimationSequence, type MotionValue } from "motion/react";
import { useArtworkPlayback } from "~/components/use-artwork-playback";
import type { ProjectSlug } from "~/data/site";
import "~/styles/project-art.css";

const ease = [0.32, 0.02, 0.2, 1] as const;
const sequences: Record<ProjectSlug, AnimationSequence> = {
  send: [
    [".project-art-one", { x: [-72, 0], opacity: [0.1, 1] }, { at: 0.1, duration: 2.1, ease }],
    [".project-art-two", { x: [64, 0], opacity: [0.1, 1] }, { at: 0.35, duration: 2.1, ease }],
    [".project-art-three", { x: [-88, 0], opacity: [0.1, 1] }, { at: 0.6, duration: 2.1, ease }],
  ],
  shenanigan: [
    [".project-art-one", { y: [64, 0], opacity: [0.1, 1] }, { at: 0.1, duration: 1.9, ease }],
    [".project-art-two", { y: [82, 0], opacity: [0.1, 1] }, { at: 0.4, duration: 1.9, ease }],
    [".project-art-three", { y: [100, 0], opacity: [0.1, 1] }, { at: 0.7, duration: 1.9, ease }],
  ],
  brightid: [
    [".project-art-one", { x: [-68, 0], opacity: [0.1, 1] }, { at: 0.1, duration: 2.2, ease }],
    [".project-art-two", { y: [46, 0], opacity: [0.1, 1] }, { at: 0.3, duration: 2.2, ease }],
    [".project-art-three", { x: [68, 0], opacity: [0.1, 1] }, { at: 0.5, duration: 2.2, ease }],
  ],
  "open-source": [
    [".project-art-one", { scale: [1.16, 1], y: [-42, 0], opacity: [0.1, 1] }, { at: 0.1, duration: 2.2, ease }],
    [".project-art-two", { scale: [1.16, 1], x: [-64, 0], opacity: [0.1, 1] }, { at: 0.35, duration: 2.2, ease }],
    [".project-art-three", { scale: [1.16, 1], x: [64, 0], opacity: [0.1, 1] }, { at: 0.6, duration: 2.2, ease }],
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
