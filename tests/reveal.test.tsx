import { act, cleanup, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "~/components/reveal";
import { MotionSystem, useMotionSettings } from "~/components/motion-system";

function PreferenceProbe() {
  const { reducedMotion } = useMotionSettings();
  return <output>{reducedMotion ? "Static" : "Kinetic"}</output>;
}

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("progressive motion", () => {
  it("prerenders readable content with no hidden entrance state", () => {
    const html = renderToStaticMarkup(<MotionSystem><Reveal>Project story</Reveal></MotionSystem>);
    expect(html).toContain("Project story");
    expect(html).not.toMatch(/opacity:\s*0|visibility:\s*hidden/);
  });

  it("updates the motion policy when the operating-system preference changes", () => {
    const reduced = new EventTarget();
    Object.assign(reduced, { matches: false });
    vi.stubGlobal("matchMedia", (query: string) => query.includes("reduced-motion") ? reduced : Object.assign(new EventTarget(), { matches: true }));
    render(<MotionSystem><PreferenceProbe /></MotionSystem>);
    expect(screen.getByText("Kinetic")).toBeInTheDocument();
    act(() => {
      Object.assign(reduced, { matches: true });
      reduced.dispatchEvent(new Event("change"));
    });
    expect(screen.getByText("Static")).toBeInTheDocument();
    act(() => {
      Object.assign(reduced, { matches: false });
      reduced.dispatchEvent(new Event("change"));
    });
    expect(screen.getByText("Kinetic")).toBeInTheDocument();
  });
});
