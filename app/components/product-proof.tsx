import { ArrowUpRight } from "@phosphor-icons/react";
import { useId } from "react";
import type { EvidenceAsset, HeroAsset, SiteNativeRecord } from "~/data/site";

type DocumentaryAsset = HeroAsset | EvidenceAsset;

function SiteNativeRecordView({ record }: { record: SiteNativeRecord }) {
  switch (record.kind) {
    case "system-flow":
      return (
        <>
          <strong>{record.label}</strong>
          <ol className="native-record-flow">
            {record.steps.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}
          </ol>
          <p>{record.fact}</p>
        </>
      );
    case "release-record":
      return (
        <>
          <span className="native-record-label">{record.label}</span>
          <strong>{record.value}</strong>
          <span className="native-record-period">{record.period}</span>
          <p>{record.fact}</p>
        </>
      );
    case "document-record":
      return (
        <>
          <span className="native-record-label">{record.status}</span>
          <strong>{record.document}</strong>
          <code>{record.repository}</code>
          <p>{record.fact}</p>
        </>
      );
    case "architecture-record":
      return (
        <>
          <strong>{record.label}</strong>
          <ol className="native-record-path">
            {record.path.map((step) => <li key={step}>{step}</li>)}
          </ol>
          <p>{record.fact}</p>
        </>
      );
    case "code-record":
      return (
        <>
          <span className="native-record-label">{record.status}</span>
          <strong>{record.revision}</strong>
          <code>{record.repository}</code>
          <p>{record.contribution}</p>
        </>
      );
    case "contribution-record":
      return (
        <>
          <span className="native-record-label">{record.status} · {record.record}</span>
          <strong>{record.project}</strong>
          <p>{record.contribution}</p>
        </>
      );
    case "record-set":
      return (
        <>
          <span className="native-record-label">{record.label}</span>
          <strong>{record.count}</strong>
          <ul className="native-record-set">{record.records.map((item) => <li key={item}>{item}</li>)}</ul>
          <p>{record.fact}</p>
        </>
      );
  }
}

export function ProductProof({
  asset,
  priority = false,
  className = "",
}: {
  asset: DocumentaryAsset;
  priority?: boolean;
  className?: string;
}) {
  const captionTitleId = useId();
  const sourceUrls = asset.source.kind === "public-primary-sources" ? asset.source.urls : [];

  return (
    <figure
      className={`product-proof product-proof-${asset.media} ${className}`.trim()}
      data-candidate-id={asset.candidateId}
      data-priority={priority ? "primary" : "supporting"}
      aria-labelledby={captionTitleId}
    >
      <div className="product-proof-status" aria-label="Provisional asset review status">
        <span>{asset.review.agentApproval}</span>
        <span>{asset.review.humanApproval}</span>
      </div>

      {asset.media === "pending-original" ? (
        <div className="product-proof-slot" role="img" aria-label={asset.alt}>
          <span className="product-proof-kicker">Approved evidence slot</span>
          <strong>Original asset pending</strong>
          <span>No substitute media shown</span>
        </div>
      ) : asset.media === "site-native" ? (
        <div className="product-proof-native" role="group" aria-labelledby={captionTitleId}>
          <span className="product-proof-kicker">
            {asset.source.kind === "public-primary-sources" ? "Primary-record interpretation" : "Owner-attested portfolio record"}
          </span>
          <SiteNativeRecordView record={asset.record} />
          <small className="product-proof-disclosure">{asset.disclosure}</small>
        </div>
      ) : (
        <img
          className="product-proof-image"
          src={asset.src}
          width={asset.width}
          height={asset.height}
          alt={asset.alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
        />
      )}

      <figcaption>
        <span className="product-proof-priority">{priority ? "Primary evidence" : "Supporting evidence"}</span>
        <h3 id={captionTitleId}>{asset.title}</h3>
        <p>{asset.caption}</p>
        <div className="product-proof-sources">
          <span>Source</span>
          {sourceUrls.length > 0 ? (
            sourceUrls.map((url, index) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                Primary record{sourceUrls.length > 1 ? ` ${index + 1}` : ""}
                <ArrowUpRight size="1em" weight="bold" aria-hidden />
              </a>
            ))
          ) : (
            <span>{asset.media === "pending-original" ? "Owner-supplied original pending" : "Owner-supplied supporting artifact pending"}</span>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
