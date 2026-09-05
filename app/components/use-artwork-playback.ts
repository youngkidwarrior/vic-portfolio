import { inView, useAnimate, type AnimationSequence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useMotionSettings } from "~/components/motion-system";

// A decoded print earns one timed entrance. Replay is an explicit visitor action.
export function useArtworkPlayback<T extends Element>(src: string, sequence: AnimationSequence) {
  const [scope, animate] = useAnimate<T>();
  const { reducedMotion } = useMotionSettings();
  const played = useRef(false);
  const play = useRef<(() => void) | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const element = scope.current;
    let cancelled = false;
    let stopObserving: (() => void) | undefined;
    let playback: ReturnType<typeof animate> | undefined;
    const start = () => {
      playback?.complete();
      playback?.stop();
      played.current = true;
      playback = animate(sequence);
    };
    const stopPreloading = inView(element, () => {
      const image = new Image();
      image.fetchPriority = "low";
      image.src = src;
      void image.decode().then(() => {
        if (cancelled) return;
        setReady(true);
        play.current = start;
        stopObserving = inView(element, () => {
          if (!played.current) start();
        // Oversized background prints are intentionally cropped by the layout.
        }, { amount: 0.25 });
      }).catch(() => {
        // Keep the original print when the image cannot be decoded.
      });
    }, { margin: "200px" });
    return () => {
      cancelled = true;
      play.current = undefined;
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

  return { scope, reducedMotion, ready, replay: () => play.current?.() };
}
