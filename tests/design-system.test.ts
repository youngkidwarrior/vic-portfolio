import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("app/styles/app.css", "utf8");

describe("Montréal Editorial design system", () => {
  it("uses the approved warm-paper Olympic palette", () => {
    expect(css).toContain("--canvas: #f3f0e8;");
    expect(css).toContain("--ink: #171715;");
    expect(css).toContain("--accent: #19639b;");
    expect(css).toContain("--red: #b92d35;");
    expect(css).toContain("--yellow: #d9ad22;");
    expect(css).toContain("--green: #087b53;");
  });

  it("treats paper texture as a continuous page material", () => {
    expect(css).toMatch(/body\s*\{[^}]*background-image:/s);
    expect(css).toContain("--paper-grain:");
    expect(css).not.toContain("backdrop-filter:");
  });

  it("uses flat editorial rules instead of offset card effects", () => {
    expect(css).not.toContain("box-shadow:");
    expect(css).not.toContain("translate(-3px, -3px)");
    expect(css).toMatch(/\.product-proof\s*\{[^}]*border-left:\s*0;[^}]*border-right:\s*0;[^}]*background:\s*transparent;/s);
  });
});
