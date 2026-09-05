import { inView, useAnimate } from "motion/react";
import { useEffect, type PropsWithChildren } from "react";
import { editorialEase, useMotionSettings } from "~/components/motion-system";

export function Reveal({ children, className = "", delay = 0 }: PropsWithChildren<{ className?: string; delay?: number }>) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const { reducedMotion } = useMotionSettings();

  useEffect(() => {
    const element = scope.current;
    if (reducedMotion) return;
    // Never hide something the visitor can already see, including restored scroll
    // positions and slow hydration. Only offscreen content earns an entrance.
    const bounds = element.getBoundingClientRect();
    if (bounds.top < window.innerHeight && bounds.bottom > 0) return;
    const prepare = animate(element, { opacity: 0, y: 28 }, { duration: 0 });
    let entrance: ReturnType<typeof animate> | undefined;
    const stop = inView(element, () => {
      entrance = animate(element, { opacity: 1, y: 0 }, { duration: 0.72, delay, ease: editorialEase });
    }, { margin: "0px 0px -48px 0px" });
    return () => {
      stop();
      prepare.stop();
      entrance?.stop();
      element.style.removeProperty("opacity");
      element.style.removeProperty("transform");
    };
  }, [animate, delay, reducedMotion, scope]);

  return <div ref={scope} className={`reveal-motion ${className}`}>{children}</div>;
}
