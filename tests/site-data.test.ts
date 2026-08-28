import { describe, expect, it } from "vitest";
import { getProject, projectBySlug, projects, recognition, site } from "~/data/site";

describe("portfolio content model", () => {
  it("has four unique projects with stable route lookups", () => {
    expect(projects).toHaveLength(4);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length);

    for (const project of projects) {
      expect(projectBySlug[project.slug]).toBe(project);
      expect(getProject(project.slug)).toBe(project);
    }
    expect(getProject("not-a-project")).toBeUndefined();
  });

  it("keeps every public image and project action on HTTPS", () => {
    for (const project of projects) {
      expect(project.screenshot.href).toMatch(/^https:\/\//);
      for (const link of project.links) expect(link.href).toMatch(/^https:\/\//);
    }
    for (const source of recognition.supportingProof) expect(source.source).toMatch(/^https:\/\//);
  });

  it("preserves the strongest public outcomes", () => {
    expect(getProject("send")?.metrics[0]).toEqual({ value: "$53M+", label: "onchain transfer volume" });
    expect(getProject("shenanigan")?.metrics[0]).toEqual({ value: "$100K+", label: "community support raised" });
    expect(getProject("brightid")?.metrics[0]).toEqual({ value: "11K+", label: "people verified in one year" });
    expect(getProject("open-source")?.metrics[0]).toEqual({ value: "4", label: "ecosystems represented" });
  });

  it("contains no retired review workflow or private phone number", () => {
    expect(JSON.stringify({ site, projects, recognition })).not.toMatch(
      /agent-approved|human-pending|candidateId|evidenceGallery|heroAsset|decorativeArt|626|808-7834/i,
    );
  });
});
