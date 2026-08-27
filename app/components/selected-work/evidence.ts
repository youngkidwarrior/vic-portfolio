import type { EvidenceAsset, Project } from "~/data/site";

export function requireEvidence(project: Project, candidateId: EvidenceAsset["candidateId"]): EvidenceAsset {
  const asset = project.evidenceGallery.find((candidate) => candidate.candidateId === candidateId);

  if (!asset) {
    throw new Error(`Missing ${candidateId} evidence for ${project.slug}`);
  }

  return asset;
}

export function primarySource(asset: EvidenceAsset): string {
  if (asset.source.kind !== "public-primary-sources") {
    throw new Error(`Evidence ${asset.candidateId} requires a public primary source`);
  }

  return asset.source.urls[0];
}
