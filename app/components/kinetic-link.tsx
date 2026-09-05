import * as m from "motion/react-m";
import { useMotionValue, useSpring, type HTMLMotionProps } from "motion/react";
import { useEffect } from "react";
import { useMotionSettings } from "~/components/motion-system";

export function KineticLink({ children, className, ...props }: HTMLMotionProps<"a">) {
  const { reducedMotion, finePointer } = useMotionSettings();
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 240, damping: 22 });
  const y = useSpring(targetY, { stiffness: 240, damping: 22 });
  useEffect(() => {
    if (!reducedMotion) return;
    targetX.set(0); targetY.set(0); x.jump(0); y.jump(0);
  }, [reducedMotion, targetX, targetY, x, y]);
  function reset() { targetX.set(0); targetY.set(0); }
  return (
    <m.a
      {...props}
      className={className}
      style={reducedMotion ? undefined : { x, y }}
      whileTap={reducedMotion ? undefined : { scale: 0.97 }}
      onPointerMove={(event) => {
        if (reducedMotion || !finePointer || event.pointerType === "touch") return;
        const box = event.currentTarget.getBoundingClientRect();
        targetX.set(((event.clientX - box.left) / box.width - 0.5) * 8);
        targetY.set(((event.clientY - box.top) / box.height - 0.5) * 6);
      }}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {children}
    </m.a>
  );
}
