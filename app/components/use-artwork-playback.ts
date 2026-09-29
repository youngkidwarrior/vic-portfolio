import { inView, useAnimate, type AnimationSequence } from "motion/react";
import { useEffect, useRef } from "react";
import { useMotionSettings } from "~/components/motion-system";
import "~/styles/artwork-playback.css";

// A decoded print earns one timed entrance, then holds its completed composition.
export function useArtworkPlayback<T extends Element>(src: string, sequence: AnimationSequence) {
  const [scope, animate] = useAnimate<T>();
  const { reducedMotion } = useMotionSettings();
  const played = useRef(false);

  useEffect(() => {
    if (reducedMotion) return;
    const element = scope.current;
    let cancelled = false;
    let stopObserving: (() => void) | undefined;
    let playback: ReturnType<typeof animate> | undefined;
    // One viewport of lead time keeps preparation ahead of a normal scroll.
    // Playback still waits for actual entry, and distant sections stay lazy.
    const stopPreloading = inView(element, () => {
      // Prepare the rendered images, not just a detached copy. Native lazy
      // loading otherwise decides independently when these layers are ready.
      const images = [...element.querySelectorAll<HTMLImageElement>("img[data-art-media]")];
      if (images.length === 0) {
        // SVGImageElement has no decode API; prime its shared image resource.
        const image = new Image();
        image.fetchPriority = "low";
        image.src = src;
        images.push(image);
      }
      void Promise.all(images.map(image => {
        image.loading = "eager";
        return image.decode();
      })).then(() => {
        if (cancelled) return;
        // Oversized background prints are intentionally cropped by the layout.
        stopObserving = inView(element, () => {
          if (played.current) return;
          played.current = true;
          playback = animate(sequence);
        }, { amount: 0.25 });
      }).catch(() => {
        // Keep the original print when the image cannot be decoded.
      });
    }, { margin: `${window.innerHeight}px 0px` });
    return () => {
      cancelled = true;
      stopPreloading();
      stopObserving?.();
      // Complete Motion's values before stopping queued SVG/DOM renders.
      playback?.complete();
      playback?.stop();
      element.querySelectorAll<HTMLElement | SVGElement>("[data-art-layer]").forEach(layer => {
        layer.style.removeProperty("opacity");
        layer.style.removeProperty("transform");
      });
    };
  }, [animate, reducedMotion, scope, sequence, src]);

  return { scope, reducedMotion };
}
