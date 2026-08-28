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

  it("keeps poster art atmospheric while restoring its printed color", () => {
    expect(css).toMatch(/\.atmospheric-art\s*\{[^}]*opacity:\s*\.24;/s);
    expect(css).toMatch(/\.atmospheric-art\s*\{[^}]*filter:\s*saturate\(1\.14\) contrast\(1\.08\);/s);
    expect(css).toMatch(/\.selected-work-atmosphere\s*\{[^}]*opacity:\s*\.22;/s);
  });

  it("carries each project ink through its structural accents", () => {
    expect(css).toMatch(/\.project-row\s*\{[^}]*border-top:\s*\.45rem solid var\(--project-color\);/s);
    expect(css).toMatch(/\.project-row \.metric-line strong\s*\{[^}]*color:\s*var\(--project-ink\);/s);
    expect(css).toMatch(/\.project-row \.text-link\s*\{[^}]*color:\s*var\(--project-ink\);/s);
  });

  it("uses explicit approval-state inks", () => {
    expect(css).not.toContain("var(--text)");
    expect(css).toMatch(/\.recognition-proof-status span:first-child\s*\{[^}]*color:\s*var\(--green-ink\);/s);
    expect(css).toMatch(/\.recognition-proof-status span:last-child\s*\{[^}]*color:\s*var\(--red\);/s);
  });

  it("uses flat editorial rules instead of offset card effects", () => {
    expect(css).not.toContain("box-shadow:");
    expect(css).not.toContain("translate(-3px, -3px)");
    expect(css).toMatch(/\.product-proof\s*\{[^}]*border-left:\s*0;[^}]*border-right:\s*0;[^}]*background:\s*transparent;/s);
  });
});
