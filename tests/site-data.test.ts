import { describe, expect, it } from "vitest";
import {
  approvedCandidateManifest,
  getProject,
  projectBySlug,
  projects,
  site,
  type ProjectAsset,
} from "~/data/site";

const documentaryAssets = projects.flatMap((project) => [
  ...(project.brandMark ? [project.brandMark] : []),
  project.heroAsset,
  ...project.evidenceGallery,
] satisfies Exclude<ProjectAsset, { role: "decorative-atmosphere" }>[]);
const decorations = projects.map((project) => project.decorativeArt);

describe("portfolio content model", () => {
  it("has unique routes, candidates, and stable slug lookups", () => {
    expect(projects).toHaveLength(4);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(projects.length);
    expect(approvedCandidateManifest).toHaveLength(37);
    expect(new Set(approvedCandidateManifest).size).toBe(approvedCandidateManifest.length);
    expect(new Set(documentaryAssets.map((asset) => asset.candidateId)).size).toBe(documentaryAssets.length);

    const approvedCandidates = new Set<string>(approvedCandidateManifest);
    for (const asset of documentaryAssets) expect(approvedCandidates.has(asset.candidateId)).toBe(true);

    for (const project of projects) {
      expect(projectBySlug[project.slug]).toBe(project);
      expect(getProject(project.slug)).toBe(project);
    }
    expect(getProject("not-a-project")).toBeUndefined();
  });

  it("separates documentary proof from decorative atmosphere by role", () => {
    for (const project of projects) {
      expect(project.heroAsset.role).toBe("hero-proof");
      expect(project.evidenceGallery.length).toBeGreaterThanOrEqual(3);
      expect(project.evidenceGallery.length).toBeLessThanOrEqual(6);
      expect(project.evidenceGallery.every((asset) => asset.role === "case-study-evidence")).toBe(true);
      expect(project.decorativeArt).toMatchObject({
        role: "decorative-atmosphere",
        alt: "",
        ariaHidden: true,
      });
    }
  });

  it("uses explicit owner-pending or one-or-more HTTPS primary sources", () => {
    for (const asset of documentaryAssets) {
      if (asset.source.kind === "owner-supplied-pending") {
        expect(asset.source).toEqual({ kind: "owner-supplied-pending" });
      } else {
        expect(asset.source.urls.length).toBeGreaterThan(0);
        for (const url of asset.source.urls) expect(url).toMatch(/^https:\/\//);
      }
      expect(JSON.stringify(asset)).not.toMatch(/\.ignore\.|\/references\//);
    }

    expect(getProject("send")?.heroAsset.source).toEqual({ kind: "owner-supplied-pending" });
    expect(JSON.stringify(getProject("send")?.heroAsset)).not.toContain("sourceUrl");
    expect(getProject("open-source")?.heroAsset.source).toEqual({
      kind: "public-primary-sources",
      urls: [
        "https://github.com/sourcecred/sourcecred/pull/2150",
        "https://github.com/1Hive/uniswap-interface/pull/30",
        "https://github.com/BrightID/brightid-python-sdk/pull/1",
        "https://github.com/JoinColony/colonyNetwork/pull/836",
      ],
    });
  });

  it("keeps every documentary candidate provisional and decorations outside approval semantics", () => {
    for (const asset of documentaryAssets) {
      expect(asset.review).toEqual({
        agentApproval: "agent-approved",
        humanApproval: "human-pending",
        publishable: false,
      });
    }
    for (const decoration of decorations) {
      expect(decoration.portfolioAssetId).toMatch(/-DECOR-001$/);
      expect(decoration).not.toHaveProperty("candidateId");
      expect(decoration).not.toHaveProperty("review");
    }
  });

  it("keeps the public contact and evidence surface free of a phone number", () => {
    expect(JSON.stringify({ site, projects })).not.toMatch(/626|808-7834/);
  });

  it("preserves key public metrics", () => {
    expect(getProject("send")?.metrics).toEqual([
      { value: "$53M+", label: "onchain transfer volume" },
      { value: "70K+", label: "passkeys supported" },
      { value: "15", label: "iOS releases in eight months" },
    ]);
    expect(getProject("shenanigan")?.metrics[0]).toEqual({
      value: "$100K+",
      label: "community support raised",
    });
    expect(getProject("brightid")?.metrics[0]).toEqual({
      value: "11K+",
      label: "people verified in one year",
    });
    expect(getProject("open-source")?.metrics[0]).toEqual({
      value: "4",
      label: "ecosystems represented",
    });
  });

  it("keeps canonical project URLs", () => {
    expect(getProject("send")?.links).toContainEqual({ label: "Visit Send", href: "https://send.it" });
    expect(getProject("shenanigan")?.links).toContainEqual({ label: "Visit PANTS", href: "https://pants.energy" });
    expect(getProject("brightid")?.links).toContainEqual({ label: "Visit BrightID Bot", href: "https://bot.brightid.org" });
  });
});
