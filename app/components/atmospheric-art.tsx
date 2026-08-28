import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { DecorativeArtAsset } from "~/data/site";

const intrinsicDimensions: Record<string, { width: number; height: number }> = {
  "/images/send-poster.webp": { width: 1123, height: 1400 },
  "/images/shenanigan-poster.webp": { width: 1122, height: 1402 },
  "/images/brightid-poster.webp": { width: 1122, height: 1402 },
  "/images/open-source-poster.webp": { width: 1122, height: 1402 },
};

export function AtmosphericArt({
  asset,
  className = "",
}: {
  asset: DecorativeArtAsset;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const constrainedMobile = useConstrainedMobile();
  const staticMotion = Boolean(reducedMotion) || constrainedMobile;
  const dimensions = intrinsicDimensions[asset.src];

  if (!dimensions) {
    throw new Error(`Missing intrinsic dimensions for decorative asset: ${asset.src}`);
  }

  return (
    <figure
      className={`atmospheric-art ${className}`.trim()}
      aria-hidden="true"
      data-motion={staticMotion ? "static" : "ambient"}
      data-provenance={asset.provenance}
    >
      <motion.img
        src={asset.src}
        alt=""
        width={dimensions.width}
        height={dimensions.height}
        loading="lazy"
        decoding="async"
        draggable={false}
        initial={false}
        animate={staticMotion ? { x: 0, y: 0 } : { x: [-12, 12, -12], y: [8, -8, 8] }}
        transition={staticMotion ? { duration: 0 } : { duration: 18, ease: "easeInOut", repeat: Infinity }}
      />
    </figure>
  );
}

function useConstrainedMobile(): boolean {
  const [constrained, setConstrained] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const query = window.matchMedia("(max-width: 620px)");
    const update = () => setConstrained(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return constrained;
}
