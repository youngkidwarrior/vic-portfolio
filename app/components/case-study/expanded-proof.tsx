import { ArrowUpRight } from "@phosphor-icons/react";
import { AtmosphericArt } from "~/components/atmospheric-art";
import { ProductProof } from "~/components/product-proof";
import type { EvidenceAsset, Project } from "~/data/site";

function evidence(project: Project, candidateId: EvidenceAsset["candidateId"]) {
  const asset = project.evidenceGallery.find((candidate) => candidate.candidateId === candidateId);

  if (!asset) throw new Error(`Missing ${candidateId} evidence for ${project.slug}`);
  return asset;
}

function sourceUrl(asset: EvidenceAsset): string | undefined {
  return asset.source.kind === "public-primary-sources" ? asset.source.urls[0] : undefined;
}

function EvidenceLink({ asset, index }: { asset: EvidenceAsset; index: number }) {
  const href = sourceUrl(asset);
  const contents = <><span>0{index}</span><strong>{asset.title}</strong><small>{asset.candidateId}</small></>;

  return href ? (
    <a href={href} target="_blank" rel="noreferrer">{contents}<ArrowUpRight size="1em" weight="bold" aria-hidden /></a>
  ) : (
    <div>{contents}<em>Owner original pending</em></div>
  );
}

function SendExpandedProof({ project }: { project: Project }) {
  const flows = [evidence(project, "SEND-FLOW-001"), evidence(project, "SEND-FLOW-002")];
  return (
    <div className="expanded-proof expanded-proof-send" data-case-hero="send-system-stage">
      <AtmosphericArt asset={project.decorativeArt} className="case-atmosphere" />
      <p className="expanded-proof-rail">Passkey <span>→</span> wallet <span>→</span> card <span>→</span> recovery</p>
      <div className="expanded-authentic-records" aria-label="Send system records">
        {flows.map((asset, index) => (
          <ProductProof
            key={asset.candidateId}
            asset={asset}
            priority={index === 0}
            className={index === 0 ? "expanded-primary-proof" : ""}
          />
        ))}
      </div>
      <div className="expanded-reserved-slot">
        <p className="mono-label">Reserved product original / secondary</p>
        <ProductProof asset={project.heroAsset} />
      </div>
    </div>
  );
}

function ShenaniganExpandedProof({ project }: { project: Project }) {
  const governance = evidence(project, "SHEN-GOV-001");
  const product = evidence(project, "SHEN-PRODUCT-002");
  return (
    <div className="expanded-proof expanded-proof-shenanigan" data-case-hero="shenanigan-product-governance-archive">
      <AtmosphericArt asset={project.decorativeArt} className="case-atmosphere" />
      <div className="archive-index" aria-hidden="true"><span>PRODUCT</span><span>GOVERNANCE</span><span>COMMUNITY</span></div>
      <ProductProof asset={governance} priority className="expanded-primary-proof" />
      <div className="archive-overlays">
        <ProductProof asset={project.heroAsset} />
        <EvidenceLink asset={product} index={2} />
      </div>
    </div>
  );
}

function BrightIdExpandedProof({ project }: { project: Project }) {
  const commit = evidence(project, "BRIGHTID-CODE-001");
  const infrastructure = evidence(project, "BRIGHTID-INFRA-001");
  return (
    <div className="expanded-proof expanded-proof-brightid" data-case-hero="brightid-journey-commit-infrastructure">
      <AtmosphericArt asset={project.decorativeArt} className="case-atmosphere" />
      <ol className="verification-spine" aria-label="BrightID evidence path">
        <li><span>01</span><strong>Journey</strong><small>Discord verification</small></li>
        <li><span>02</span><strong>Commit</strong><small>Fallback behavior</small></li>
        <li><span>03</span><strong>Infrastructure</strong><small>Service + node</small></li>
      </ol>
      <div className="expanded-authentic-records">
        <ProductProof asset={commit} priority className="expanded-primary-proof" />
        <ProductProof asset={infrastructure} />
      </div>
      <div className="expanded-reserved-slot">
        <p className="mono-label">Reserved interface original / secondary</p>
        <ProductProof asset={project.heroAsset} />
      </div>
    </div>
  );
}

function OpenSourceExpandedProof({ project }: { project: Project }) {
  const records = project.evidenceGallery.slice(0, 4);
  return (
    <div className="expanded-proof expanded-proof-open-source" data-case-hero="open-source-contribution-dossier">
      <AtmosphericArt asset={project.decorativeArt} className="case-atmosphere" />
      <div className="contribution-dossier" aria-label="Four primary contribution records">
        {records.map((asset, index) => (
          <ProductProof key={asset.candidateId} asset={asset} priority={index === 0} />
        ))}
      </div>
      <div className="expanded-reserved-slot">
        <p className="mono-label">Dossier summary / four linked records</p>
        <ProductProof asset={project.heroAsset} />
      </div>
    </div>
  );
}

export function ExpandedProof({ project }: { project: Project }) {
  switch (project.slug) {
    case "send": return <SendExpandedProof project={project} />;
    case "shenanigan": return <ShenaniganExpandedProof project={project} />;
    case "brightid": return <BrightIdExpandedProof project={project} />;
    case "open-source": return <OpenSourceExpandedProof project={project} />;
  }
}
