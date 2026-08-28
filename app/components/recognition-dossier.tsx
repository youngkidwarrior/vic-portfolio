import { ArrowUpRight } from "@phosphor-icons/react";
import type { Recognition } from "~/data/site";

type RecognitionDossierProps = {
  recognition: Recognition;
};

export function RecognitionDossier({ recognition }: RecognitionDossierProps) {
  return (
    <aside className="recognition-dossier" aria-label={`${recognition.project} recognition evidence`}>
      <header className="recognition-dossier-header">
        <span>Evidence dossier</span>
        <span>{recognition.project}</span>
      </header>

      <section
        className="recognition-proof-slot"
        data-candidate-id={recognition.awardProof.candidateId}
        aria-labelledby="recognition-proof-title"
      >
        <div className="recognition-proof-meta">
          <span>{recognition.awardProof.candidateId}</span>
          <span>Owner-attested result</span>
        </div>
        <h3 id="recognition-proof-title">{recognition.awardProof.label}</h3>
        <p>{recognition.awardProof.establishes}</p>
        <div className="recognition-proof-status" aria-label="Artifact review status">
          <span>{recognition.awardProof.review.agentApproval}</span>
          <span>{recognition.awardProof.review.humanApproval}</span>
          <span>{recognition.awardProof.artifactStatus}</span>
        </div>
      </section>

      <div className="recognition-source-list" aria-label="Supporting public evidence">
        {recognition.supportingProof.map((evidence, index) => (
          <a
            href={evidence.source}
            className="recognition-source"
            data-candidate-id={evidence.candidateId}
            key={evidence.candidateId}
            target="_blank"
            rel="noreferrer"
          >
            <span className="recognition-source-index">0{index + 1}</span>
            <span>
              <small>{evidence.candidateId}</small>
              <small className="record-review-state">
                {evidence.review.agentApproval} / {evidence.review.humanApproval}
              </small>
              <strong>{evidence.label}</strong>
              <em>{evidence.establishes}</em>
            </span>
            <ArrowUpRight size="1.05em" weight="bold" aria-hidden />
          </a>
        ))}
      </div>

      <p className="recognition-disclosure">{recognition.disclosure}</p>
    </aside>
  );
}
