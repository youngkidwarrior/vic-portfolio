import type { CSSProperties, MouseEvent } from "react";
import { useLocation, useNavigate, useViewTransitionState, type LinkProps } from "react-router";
import { useMotionSettings } from "~/components/motion-system";

type ListingOrigin = { key: string; index: number };
type ProjectNavigationState = { projectListing: ListingOrigin };

function readListingOrigin(state: unknown): ListingOrigin | undefined {
  if (!state || typeof state !== "object" || !("projectListing" in state)) return;
  const origin = state.projectListing;
  if (!origin || typeof origin !== "object" || !("key" in origin) || !("index" in origin)) return;
  if (typeof origin.key === "string" && typeof origin.index === "number" && Number.isInteger(origin.index) && origin.index >= 0) {
    return { key: origin.key, index: origin.index };
  }
}

function isSameTabClick(event: MouseEvent<HTMLAnchorElement>) {
  return !event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function useProjectTransition(slug: string) {
  const location = useLocation();
  const navigate = useNavigate();
  const { reducedMotion } = useMotionSettings();
  const path = `/work/${slug}`;
  const transitioning = useViewTransitionState(path) && !reducedMotion;
  const imageStyle: CSSProperties = { viewTransitionName: transitioning ? `project-${slug}-image` : "none" };
  const frameStyle: CSSProperties = { viewTransitionName: transitioning ? `project-${slug}-frame` : "none" };

  const detailsLinkProps: Pick<LinkProps, "to" | "onClick" | "prefetch"> = {
    to: path,
    prefetch: "intent",
    onClick(event) {
      if (!isSameTabClick(event)) return;
      event.preventDefault();
      const entry = window.history.state;
      // Read at activation: Back/Forward may have changed the current entry since render.
      const state: ProjectNavigationState | undefined = location.pathname === "/" && (entry?.key ?? "default") === location.key && Number.isInteger(entry?.idx)
        ? { projectListing: { key: location.key, index: entry.idx } }
        : undefined;
      void navigate(path, {
        state,
        viewTransition: !reducedMotion && typeof document.startViewTransition === "function",
      });
    },
  };

  const backLinkProps: Pick<LinkProps, "to" | "onClick"> = {
    to: "/#work",
    onClick(event) {
      if (!isSameTabClick(event)) return;
      const origin = readListingOrigin(location.state);
      const entry = window.history.state;
      // A state marker alone is insufficient after a copied/replaced history entry.
      // Router owns scroll restoration for the actual previous listing entry.
      if (origin && origin.key !== location.key && (entry?.key ?? "default") === location.key && entry?.idx === origin.index + 1 && window.history.length > 1) {
        event.preventDefault();
        void navigate(-1);
      }
    },
  };

  return { imageStyle, frameStyle, detailsLinkProps, backLinkProps };
}
