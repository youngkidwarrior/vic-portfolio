import * as m from "motion/react-m";
import { useTransform, type MotionStyle, type MotionValue } from "motion/react";
import { useMotionSettings } from "~/components/motion-system";
import type { ProjectSlug } from "~/data/site";
import "~/styles/project-art.css";

type ArtMotion = {
  progress: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

function ArtSlice({ slug, part, style }: { slug: ProjectSlug; part: string; style: MotionStyle }) {
  const { reducedMotion } = useMotionSettings();
  return (
    <span className={`project-art-slice project-art-${part}`}>
      <m.img
        data-art-media
        src={`/images/art/${slug}-poster.webp`}
        alt=""
        width="1120"
        height="1400"
        loading="lazy"
        decoding="async"
        draggable={false}
        style={reducedMotion ? undefined : style}
      />
    </span>
  );
}

function SendArt({ progress, pointerX }: ArtMotion) {
  const upper = useTransform(() => (progress.get() - 0.5) * 70 + pointerX.get() * 12);
  const middle = useTransform(() => (0.5 - progress.get()) * 42 - pointerX.get() * 8);
  const lower = useTransform(() => (progress.get() - 0.5) * 90 + pointerX.get() * 16);
  return <>
    <ArtSlice slug="send" part="one" style={{ x: upper }} />
    <ArtSlice slug="send" part="two" style={{ x: middle }} />
    <ArtSlice slug="send" part="three" style={{ x: lower }} />
  </>;
}

function ShenaniganArt({ progress, pointerY }: ArtMotion) {
  const firstStep = useTransform(progress, [0, 0.18, 0.32, 1], [36, 36, 0, -8]);
  const secondStep = useTransform(progress, [0, 0.24, 0.4, 1], [48, 48, 0, -8]);
  const thirdStep = useTransform(progress, [0, 0.3, 0.48, 1], [60, 60, 0, -8]);
  const first = useTransform(() => firstStep.get() + pointerY.get() * 5);
  const second = useTransform(() => secondStep.get() - pointerY.get() * 8);
  const third = useTransform(() => thirdStep.get() + pointerY.get() * 12);
  return <>
    <ArtSlice slug="shenanigan" part="one" style={{ y: first }} />
    <ArtSlice slug="shenanigan" part="two" style={{ y: second }} />
    <ArtSlice slug="shenanigan" part="three" style={{ y: third }} />
  </>;
}

function BrightIdArt({ progress, pointerX, pointerY }: ArtMotion) {
  const left = useTransform(() => (0.5 - progress.get()) * 60 - pointerX.get() * 12);
  const right = useTransform(() => (progress.get() - 0.5) * 60 + pointerX.get() * 12);
  const center = useTransform(() => (progress.get() - 0.5) * 22 + pointerY.get() * 8);
  return <>
    <ArtSlice slug="brightid" part="one" style={{ x: left }} />
    <ArtSlice slug="brightid" part="two" style={{ y: center }} />
    <ArtSlice slug="brightid" part="three" style={{ x: right }} />
  </>;
}

function OpenSourceArt({ progress, pointerX, pointerY }: ArtMotion) {
  const expansion = useTransform(progress, [0, 0.45, 1], [1.18, 1, 1.1]);
  const upper = useTransform(() => (0.5 - progress.get()) * 24 - pointerY.get() * 10);
  const left = useTransform(() => (0.5 - progress.get()) * 36 - pointerX.get() * 10);
  const right = useTransform(() => (progress.get() - 0.5) * 36 + pointerX.get() * 10);
  return <>
    <ArtSlice slug="open-source" part="one" style={{ scale: expansion, y: upper }} />
    <ArtSlice slug="open-source" part="two" style={{ scale: expansion, x: left }} />
    <ArtSlice slug="open-source" part="three" style={{ scale: expansion, x: right }} />
  </>;
}

export function ProjectArt({ slug, ...motion }: ArtMotion & { slug: ProjectSlug }) {
  return (
    <div className={`project-art project-art-${slug}`} data-artwork={slug} aria-hidden="true">
      {slug === "send" && <SendArt {...motion} />}
      {slug === "shenanigan" && <ShenaniganArt {...motion} />}
      {slug === "brightid" && <BrightIdArt {...motion} />}
      {slug === "open-source" && <OpenSourceArt {...motion} />}
    </div>
  );
}
