import { AtmosphericArt } from "~/components/atmospheric-art";
import { ProductProof } from "~/components/product-proof";
import { primarySource, requireEvidence } from "~/components/selected-work/evidence";
import { ProjectSummary } from "~/components/selected-work/project-summary";
import type { Project } from "~/data/site";

export function SendProductStage({ project }: { project: Project }) {
  const accountCreation = requireEvidence(project, "SEND-FLOW-001");
  const recovery = requireEvidence(project, "SEND-FLOW-002");

  return (
    <article className="selected-work selected-work-send" data-composition="send-product-stage">
      <ProjectSummary project={project} />
      <div className="send-product-stage">
        <AtmosphericArt asset={project.decorativeArt} className="selected-work-atmosphere" />
        <div className="send-product-frame" role="group" aria-label="Send product evidence stage">
          <div className="send-product-rail" role="group" aria-label="Send product path">
            <span>Passkey</span>
            <span>Virtual card</span>
            <span>Sendtag</span>
          </div>
          <ProductProof asset={project.heroAsset} priority className="send-primary-proof" />
          <div className="send-flow-notes">
            {[accountCreation, recovery].map((asset, index) => (
              <a href={primarySource(asset)} target="_blank" rel="noreferrer" key={asset.candidateId}>
                <span>0{index + 1}</span>
                <strong>{asset.title}</strong>
                <small>{asset.candidateId} / source-linked</small>
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
