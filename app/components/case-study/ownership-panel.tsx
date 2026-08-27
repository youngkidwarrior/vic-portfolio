import type { Project } from "~/data/site";

const ownershipFields = [
  ["Context", "context"],
  ["Mandate", "mandate"],
  ["Team / collaborators", "collaborators"],
  ["Victor's decisions", "victorDecisions"],
  ["Constraints", "constraints"],
  ["Shipped surface", "shippedSurface"],
  ["Outcome", "outcome"],
] as const satisfies ReadonlyArray<readonly [string, keyof Project["ownership"]]>;

export function OwnershipPanel({ project }: { project: Project }) {
  return (
    <section className="ownership-panel page-frame" aria-labelledby="ownership-heading">
      <header className="ownership-heading">
        <p className="mono-label">Scope of ownership</p>
        <h2 id="ownership-heading">What Victor owned and what stayed collaborative.</h2>
      </header>
      <dl className="ownership-ledger">
        {ownershipFields.map(([label, key]) => (
          <div key={key}>
            <dt>{label}</dt>
            <dd>{project.ownership[key]}</dd>
          </div>
        ))}
      </dl>
      <aside className="ownership-boundary" aria-label="Rights and privacy boundary">
        <p className="mono-label">Publication boundary / human review pending</p>
        <dl>
          <div><dt>Rights holder</dt><dd>{project.ownership.rightsHolder}</dd></div>
          <div><dt>Victor's relationship</dt><dd>{project.ownership.victorRelationship}</dd></div>
          <div><dt>Privacy review</dt><dd>{project.ownership.privacyReview}</dd></div>
        </dl>
      </aside>
    </section>
  );
}
