import { describe, expect, it } from "vitest";
import { projects, site } from "~/data/site";

describe("portfolio content model", () => {
  it("has a unique route and local artwork for every project", () => {
    expect(projects).toHaveLength(4);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length);
    for (const project of projects) {
      expect(project.art).toMatch(/^\/images\/.+\.webp$/);
      expect(project.artAlt.length).toBeGreaterThan(20);
    }
  });

  it("keeps the public contact surface free of a phone number", () => {
    expect(JSON.stringify({ site, projects })).not.toMatch(/626|808-7834/);
  });
});
