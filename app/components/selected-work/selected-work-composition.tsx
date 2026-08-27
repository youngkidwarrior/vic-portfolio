import { BrightIdVerificationPath } from "~/components/selected-work/brightid-verification-path";
import { OpenSourceLedger } from "~/components/selected-work/open-source-ledger";
import { SendProductStage } from "~/components/selected-work/send-product-stage";
import { ShenaniganArchive } from "~/components/selected-work/shenanigan-archive";
import type { Project } from "~/data/site";

export function SelectedWorkComposition({ project, sequence }: { project: Project; sequence: number }) {
  const composition = (() => {
    switch (project.slug) {
      case "send":
        return <SendProductStage project={project} />;
      case "shenanigan":
        return <ShenaniganArchive project={project} />;
      case "brightid":
        return <BrightIdVerificationPath project={project} />;
      case "open-source":
        return <OpenSourceLedger project={project} />;
      default: {
        const exhaustive: never = project.slug;
        throw new Error(`Unsupported selected-work project: ${exhaustive}`);
      }
    }
  })();

  return <div data-project-sequence={sequence}>{composition}</div>;
}
