import { AtmosphericArt } from "~/components/atmospheric-art";
import { ProductProof } from "~/components/product-proof";
import { requireEvidence } from "~/components/selected-work/evidence";
import { ProjectSummary } from "~/components/selected-work/project-summary";
import type { Project } from "~/data/site";

export function ShenaniganArchive({ project }: { project: Project }) {
  const governance = requireEvidence(project, "SHEN-GOV-001");

  return (
    <article className="selected-work selected-work-shenanigan" data-composition="shenanigan-archive-stack">
      <div className="shenanigan-heading">
        <ProjectSummary project={project} />
        <p className="founder-context">
          <span>Founder-built / community-owned</span>
          Product, contracts, infrastructure, fundraising, team, and governance held as one system.
        </p>
      </div>
      <div className="shenanigan-archive-stage">
        <AtmosphericArt asset={project.decorativeArt} className="selected-work-atmosphere" />
        <ProductProof asset={project.heroAsset} priority className="shenanigan-hero-proof" />
        <ProductProof asset={governance} className="shenanigan-governance-proof" />
      </div>
    </article>
  );
}
