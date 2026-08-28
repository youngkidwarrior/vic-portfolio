import { ArrowUpRight } from "@phosphor-icons/react";
import { AtmosphericArt } from "~/components/atmospheric-art";
import { primarySource, requireEvidence } from "~/components/selected-work/evidence";
import { ProjectSummary } from "~/components/selected-work/project-summary";
import type { Project } from "~/data/site";

const contributionIds = [
  "OSS-SC-PR-001",
  "OSS-HNY-PR-001",
  "OSS-BID-PR-001",
  "OSS-COL-PR-001",
] as const;

export function OpenSourceLedger({ project }: { project: Project }) {
  const contributions = contributionIds.map((candidateId) => requireEvidence(project, candidateId));

  return (
    <article className="selected-work selected-work-open-source" data-composition="open-source-contribution-ledger">
      <div className="open-source-heading">
        <ProjectSummary project={project} />
        <p className="ledger-key"><span>04</span> merged contributions / primary records</p>
      </div>
      <div className="contribution-ledger">
        <AtmosphericArt asset={project.decorativeArt} className="selected-work-atmosphere" />
        <div className="ledger-header" aria-hidden="true">
          <span>Project / record</span><span>Contribution</span><span>Status</span>
        </div>
        {contributions.map((asset, index) => (
          <a
            className="contribution-row"
            href={primarySource(asset)}
            target="_blank"
            rel="noreferrer"
            key={asset.candidateId}
          >
            <span className="contribution-index">0{index + 1}</span>
            <span>
              <strong>{asset.title}</strong>
              <small>{asset.candidateId}</small>
              <small className="record-review-state">{asset.review.agentApproval} / {asset.review.humanApproval}</small>
            </span>
            <span className="contribution-caption">{asset.caption}</span>
            <span className="contribution-status">Merged <ArrowUpRight size="1em" weight="bold" aria-hidden /></span>
          </a>
        ))}
      </div>
    </article>
  );
}
