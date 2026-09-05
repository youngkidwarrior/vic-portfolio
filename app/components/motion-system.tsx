import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { createContext, useContext, useMemo, useSyncExternalStore, type PropsWithChildren } from "react";

const reducedQuery = "(prefers-reduced-motion: reduce)";
const pointerQuery = "(hover: hover) and (pointer: fine)";
const serverReduced = () => true;
const serverPointer = () => false;
const readReduced = () => window.matchMedia(reducedQuery).matches;
const readPointer = () => window.matchMedia(pointerQuery).matches;
function subscribe(query: string, onChange: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const subscribeReduced = (onChange: () => void) => subscribe(reducedQuery, onChange);
const subscribePointer = (onChange: () => void) => subscribe(pointerQuery, onChange);

const MotionSettings = createContext({ reducedMotion: true, finePointer: false });
export const useMotionSettings = () => useContext(MotionSettings);
export const editorialEase = [0.22, 1, 0.36, 1] as const;
export const responseSpring = { type: "spring", stiffness: 260, damping: 24 } as const;

export function MotionSystem({ children }: PropsWithChildren) {
  // The installed Motion hook snapshots the preference at mount. Subscribe here
  // so enabling reduced motion also stops an already interactive page.
  const reducedMotion = useSyncExternalStore(subscribeReduced, readReduced, serverReduced);
  const finePointer = useSyncExternalStore(subscribePointer, readPointer, serverPointer);
  const settings = useMemo(() => ({ reducedMotion, finePointer }), [reducedMotion, finePointer]);
  return (
    <MotionSettings.Provider value={settings}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion={reducedMotion ? "always" : "never"} transition={responseSpring}>
          {children}
        </MotionConfig>
      </LazyMotion>
    </MotionSettings.Provider>
  );
}
