import type { AnimationSequence } from "motion/react";
import { useId } from "react";
import { ArtworkReplay } from "~/components/artwork-replay";
import { useArtworkPlayback } from "~/components/use-artwork-playback";

const artwork = "/images/art/hero-poster.webp";
const inkEase = [0.32, 0.02, 0.2, 1] as const;
const sequence: AnimationSequence = [
  [".convergence-rest", { opacity: [0.1, 0.1, 1] }, { duration: 3.2, times: [0, 0.85, 1] }],
  [".convergence-blue", { x: [-150, 0], opacity: [0, 1] }, { at: 0.12, duration: 2.1, ease: inkEase }],
  [".convergence-red", { x: [-120, 0], opacity: [0, 1] }, { at: 0.38, duration: 2.1, ease: inkEase }],
  [".convergence-yellow", { x: [-140, 0], opacity: [0, 1] }, { at: 0.64, duration: 2.1, ease: inkEase }],
  [".convergence-green", { x: [-180, 0], opacity: [0, 1] }, { at: 0.9, duration: 2.1, ease: inkEase }],
];

// Source-image coordinates follow the gaps between inks and stop before the hub.
const paths = [
  { ink: "blue", shape: "M0 0H1000V527C900 527 875 468 710 452H0Z" },
  { ink: "red", shape: "M0 452H710C875 468 900 527 1000 527V540C810 540 805 596 620 619H0Z" },
  { ink: "yellow", shape: "M0 619H620C805 596 810 540 1000 540V552C804 552 775 728 586 714H0Z" },
  { ink: "green", shape: "M0 714H586C775 728 804 552 1000 552V992H0Z" },
] as const;

export function HeroArt() {
  const id = useId();
  const { scope, ...playback } = useArtworkPlayback<SVGSVGElement>(artwork, sequence);

  return <>
    <svg ref={scope} className="hero-art-media hero-convergence" viewBox="0 150 1586 760" aria-hidden="true" focusable="false">
      <defs>
        {paths.map(({ ink, shape }) => <clipPath key={ink} id={`${id}-${ink}`}><path d={shape} /></clipPath>)}
        <clipPath id={`${id}-hub`}><path d="M1000 0H1586V992H1000Z" /></clipPath>
      </defs>
      <image data-art-layer className="convergence-rest" href={artwork} width="1586" height="992" />
      {paths.map(({ ink }) => (
        <g data-art-layer key={ink} className={`convergence-band convergence-${ink}`}>
          <image clipPath={`url(#${id}-${ink})`} href={artwork} width="1586" height="992" />
        </g>
      ))}
      <image className="convergence-hub" clipPath={`url(#${id}-hub)`} href={artwork} width="1586" height="992" />
    </svg>
    <ArtworkReplay name="Convergence" {...playback} />
  </>;
}
