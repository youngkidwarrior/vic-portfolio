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

  it("keeps outcomes in human-readable project copy instead of a metrics model", () => {
    expect(getProject("send")?.lede).toContain("$53M+");
    expect(getProject("shenanigan")?.contributions.map(({ detail }) => detail).join(" ")).toContain("$100K+");
    expect(getProject("brightid")?.lede).toContain("11,000+");
    expect(getProject("open-source")?.lede).toContain("four open-source ecosystems");
    expect(JSON.stringify(projects)).not.toMatch(/"metrics"/);
  });

  it("represents the complete primary contribution scope from the resume", () => {
    expect(getProject("send")?.contributions).toHaveLength(5);
    expect(getProject("shenanigan")?.contributions).toHaveLength(4);
    expect(getProject("brightid")?.contributions).toHaveLength(4);
    expect(getProject("open-source")?.contributions).toHaveLength(4);
    expect(getProject("open-source")?.links.map(({ label }) => label)).toEqual([
      "SourceCred",
      "Honeyswap",
      "BrightID",
      "Colony",
    ]);

    for (const project of projects) {
      expect(project.contributions.length).toBeGreaterThan(0);
      expect(new Set(project.contributions.map(({ title }) => title)).size).toBe(project.contributions.length);
      for (const contribution of project.contributions) {
        expect(contribution.title.trim()).not.toBe("");
        expect(contribution.detail.trim()).not.toBe("");
      }
    }
    expect(JSON.stringify(projects)).not.toMatch(/"clientStory"|"challenge":/i);
  });

  it("contains no retired review workflow or private phone number", () => {
    expect(JSON.stringify({ site, projects, recognition })).not.toMatch(
      /agent-approved|human-pending|candidateId|evidenceGallery|heroAsset|decorativeArt|626|808-7834/i,
    );
  });
});
