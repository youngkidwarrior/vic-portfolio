import { AtmosphericArt } from "~/components/atmospheric-art";
import { ProductProof } from "~/components/product-proof";
import { requireEvidence } from "~/components/selected-work/evidence";
import { ProjectSummary } from "~/components/selected-work/project-summary";
import type { EvidenceAsset, Project } from "~/data/site";

function VerificationStep({ number, asset }: { number: string; asset: EvidenceAsset }) {
  return (
    <div className="verification-step">
      <span>{number}</span>
      <ProductProof asset={asset} />
    </div>
  );
}

export function BrightIdVerificationPath({ project }: { project: Project }) {
  const implementation = requireEvidence(project, "BRIGHTID-CODE-001");
  const infrastructure = requireEvidence(project, "BRIGHTID-INFRA-001");

  return (
    <article className="selected-work selected-work-brightid" data-composition="brightid-verification-path">
      <div className="brightid-path-stage">
        <AtmosphericArt asset={project.decorativeArt} className="selected-work-atmosphere" />
        <div className="verification-path" role="group" aria-label="BrightID verification evidence path">
          <div className="verification-step verification-step-primary">
            <span>01</span>
            <ProductProof asset={project.heroAsset} priority />
          </div>
          <VerificationStep number="02" asset={implementation} />
          <VerificationStep number="03" asset={infrastructure} />
        </div>
      </div>
      <ProjectSummary project={project} />
    </article>
  );
}
