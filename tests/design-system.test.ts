import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("app/styles/app.css", "utf8");

describe("Montréal Editorial design system", () => {
  it("uses the Campaign 3 saturated screen-print palette", () => {
    expect(css).toContain("--canvas: #f1eadb;");
    expect(css).toContain("--ink: #11110f;");
    expect(css).toContain("--accent: #0057a8;");
    expect(css).toContain("--red: #d12732;");
    expect(css).toContain("--yellow: #efb91f;");
    expect(css).toContain("--green: #007a4d;");
  });

  it("treats paper texture as a continuous page material", () => {
    expect(css).toMatch(/body\s*\{[^}]*background-image:/s);
    expect(css).toContain("--paper-grain:");
    expect(css).toContain("--screenprint-grain:");
    expect(css).not.toContain("backdrop-filter:");
  });

  it("carries each project ink through its structural accents", () => {
    expect(css).toMatch(/\.project-row\s*\{[^}]*border-top:\s*\.45rem solid var\(--project-color\);/s);
    expect(css).toMatch(/\.project-row \.metric-line strong\s*\{[^}]*color:\s*var\(--project-ink\);/s);
    expect(css).toMatch(/\.project-row \.text-link\s*\{[^}]*color:\s*var\(--project-ink\);/s);
  });

  it("uses flat editorial rules instead of offset card effects", () => {
    expect(css).not.toContain("box-shadow:");
    expect(css).not.toContain("translate(-3px, -3px)");
    expect(css).toMatch(/\.project-screenshot, \.case-screenshot\s*\{[^}]*border-top:/s);
  });

  it("contains no retired evidence or approval presentation selectors", () => {
    expect(css).not.toMatch(/product-proof|evidence-|ownership-|recognition-dossier|agent-approved|human-pending/);
  });
});
