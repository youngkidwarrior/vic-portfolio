import { ProductProof } from "~/components/product-proof";
import type { ApprovedCandidateId, EvidenceAsset, Project, ProjectSlug } from "~/data/site";

type EvidenceChapter = {
  phase: string;
  heading: string;
  narrative: string;
  candidateIds: readonly ApprovedCandidateId[];
};

const chapters: Record<ProjectSlug, readonly EvidenceChapter[]> = {
  send: [
    { phase: "Identity", heading: "Make ownership feel immediate.", narrative: "Sendtag and profile proof establish the human identity layer before the payment system underneath it.", candidateIds: ["SEND-UI-002", "SEND-UI-003"] },
    { phase: "Trust path", heading: "Design the unhappy path, too.", narrative: "Account creation and recovery records sit together because the passkey model is only complete when access can be restored.", candidateIds: ["SEND-FLOW-001", "SEND-FLOW-002"] },
    { phase: "Delivery", heading: "Turn architecture into a shipping cadence.", narrative: "The release record connects shared application architecture to the public native surface that reached users.", candidateIds: ["SEND-RELEASE-001", "SEND-UI-001"] },
  ],
  shenanigan: [
    { phase: "Governance", heading: "Write the operating system in public.", narrative: "The governance proposal records how participation and ownership were intended to work, not just how the product looked.", candidateIds: ["SHEN-GOV-001"] },
    { phase: "Runway", heading: "Make the mechanism answer a company constraint.", narrative: "PANTS is paired with contribution infrastructure to show fundraising and measurable participation as one product system.", candidateIds: ["SHEN-PRODUCT-002", "SHEN-CONTRIB-001"] },
    { phase: "Archive", heading: "Preserve the evolution without rewriting it.", narrative: "Historical documents and concepts are labeled as archive material, with authorship and version boundaries kept visible.", candidateIds: ["SHEN-DOC-001", "SHEN-HISTORY-001"] },
  ],
  brightid: [
    { phase: "Journey", heading: "Meet communities where verification happens.", narrative: "A redacted interface record leads the sequence while protecting the people and identifiers present in the original service.", candidateIds: ["BRIGHTID-UI-002"] },
    { phase: "Implementation", heading: "Anchor reliability claims to the code.", narrative: "The immutable fallback commit is direct evidence of the behavior Victor implemented.", candidateIds: ["BRIGHTID-CODE-001"] },
    { phase: "Operations", heading: "Own the service behind the interaction.", narrative: "The site-native infrastructure schematic documents the managed service and node boundary without exposing live operations.", candidateIds: ["BRIGHTID-INFRA-001"] },
  ],
  "open-source": [
    { phase: "Product UI", heading: "Improve the surface and preserve the system.", narrative: "SourceCred and Honeyswap records pair responsive interface work with wallet behavior in public review.", candidateIds: ["OSS-SC-PR-001", "OSS-HNY-PR-001"] },
    { phase: "Identity + protocol", heading: "Follow the feature through its underlying contract.", narrative: "BrightID and Colony contributions show SDK and Solidity work where user behavior meets protocol logic.", candidateIds: ["OSS-BID-PR-001", "OSS-COL-PR-001"] },
    { phase: "Attribution", heading: "Let primary records carry the claim.", narrative: "The project index remains supporting context; the merged pull requests stay the documentary evidence.", candidateIds: ["OSS-MARK-STRIP-001"] },
  ],
};

function requireChapterEvidence(project: Project, candidateId: ApprovedCandidateId): EvidenceAsset {
  const asset = project.evidenceGallery.find((candidate) => candidate.candidateId === candidateId);
  if (!asset) throw new Error(`Missing ${candidateId} evidence for ${project.slug}`);
  return asset;
}

export function EvidenceSequence({ project }: { project: Project }) {
  const projectChapters = chapters[project.slug];

  return (
    <section
      className={`evidence-sequence page-frame evidence-sequence-${project.slug}`}
      aria-labelledby="evidence-heading"
      data-evidence-count={project.evidenceGallery.length}
    >
      <header className="evidence-heading">
        <p className="mono-label">Evidence sequence / {project.evidenceGallery.length} records</p>
        <h2 id="evidence-heading">The record follows the decisions.</h2>
      </header>
      <div className="evidence-chapters">
        {projectChapters.map((chapter, chapterIndex) => {
          const assets = chapter.candidateIds.map((candidateId) => requireChapterEvidence(project, candidateId));
          return (
            <article className="evidence-chapter" key={chapter.phase} data-evidence-phase={chapter.phase}>
              <div className="evidence-chapter-copy">
                <p className="mono-label">0{chapterIndex + 1} / {chapter.phase}</p>
                <h3>{chapter.heading}</h3>
                <p>{chapter.narrative}</p>
              </div>
              <div className="evidence-chapter-records">
                {assets.map((asset) => <ProductProof key={asset.candidateId} asset={asset} />)}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
