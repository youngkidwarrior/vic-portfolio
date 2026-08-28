import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProjectPage } from "~/components/project-page";
import { projects } from "~/data/site";

vi.mock("~/components/reveal", () => ({
  Reveal: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <div className={className}>{children}</div>
  ),
}));

vi.mock("~/components/atmospheric-art", () => ({
  AtmosphericArt: () => <figure aria-hidden="true" data-testid="case-atmosphere" />,
}));

afterEach(cleanup);

const Content = () => <><h2>Narrative</h2><p>Project narrative.</p></>;

describe("evidence-first case studies", () => {
  it("uses a distinct expanded proof composition for each project", () => {
    const expected = [
      "send-system-stage",
      "shenanigan-product-governance-archive",
      "brightid-journey-commit-infrastructure",
      "open-source-contribution-dossier",
    ];

    const primaryCandidates = ["SEND-FLOW-001", "SHEN-GOV-001", "BRIGHTID-CODE-001", "OSS-SC-PR-001"];

    projects.forEach((project, index) => {
      const { container, unmount } = render(
        <MemoryRouter><ProjectPage project={project} Content={Content} /></MemoryRouter>,
      );

      const hero = container.querySelector("[data-case-hero]") as HTMLElement;
      expect(hero).toHaveAttribute("data-case-hero", expected[index]);
      expect(hero.querySelector("[data-priority='primary']")).toHaveAttribute("data-candidate-id", primaryCandidates[index]);
      if (project.heroAsset.media === "pending-original") {
        expect(hero.querySelector(`[data-candidate-id='${project.heroAsset.candidateId}']`)).toHaveAttribute(
          "data-priority",
          "supporting",
        );
      }
      expect(screen.getByTestId("case-atmosphere")).toHaveAttribute("aria-hidden", "true");
      unmount();
    });
  });

  it("publishes the complete ownership narrative and preserves its review boundary", () => {
    const project = projects[0];
    render(<MemoryRouter><ProjectPage project={project} Content={Content} /></MemoryRouter>);

    const panel = screen.getByRole("region", { name: /what victor owned/i });
    for (const label of [
      "Context",
      "Mandate",
      "Team / collaborators",
      "Victor's decisions",
      "Constraints",
      "Shipped surface",
      "Outcome",
    ]) {
      expect(within(panel).getByText(label)).toBeInTheDocument();
    }
    expect(within(panel).getByText(/human review pending/i)).toBeInTheDocument();
    expect(within(panel).getByText(project.ownership.privacyReview)).toBeInTheDocument();
  });

  it("renders 3–6 sequenced artifacts with captions, sources, and provisional status", () => {
    projects.forEach((project) => {
      const { container, unmount } = render(
        <MemoryRouter><ProjectPage project={project} Content={Content} /></MemoryRouter>,
      );
      const sequence = container.querySelector(".evidence-sequence") as HTMLElement;
      const artifacts = sequence.querySelectorAll(".product-proof");

      expect(artifacts.length).toBe(project.evidenceGallery.length);
      expect(artifacts.length).toBeGreaterThanOrEqual(3);
      expect(artifacts.length).toBeLessThanOrEqual(6);
      for (const artifact of artifacts) {
        expect(within(artifact as HTMLElement).getByText("agent-approved")).toBeInTheDocument();
        expect(within(artifact as HTMLElement).getByText("human-pending")).toBeInTheDocument();
        expect(within(artifact as HTMLElement).getByText("Source")).toBeInTheDocument();
        expect(artifact.querySelector("figcaption h3")).not.toBeNull();
        expect(artifact.querySelector("figcaption > p")).not.toBeEmptyDOMElement();
      }
      unmount();
    });
  });

  it("assigns every artifact to an explicit narrative chapter", () => {
    const expectedPairings: Record<string, Record<string, string[]>> = {
      send: {
        Identity: ["SEND-UI-002", "SEND-UI-003"],
        "Trust path": ["SEND-FLOW-001", "SEND-FLOW-002"],
        Delivery: ["SEND-RELEASE-001", "SEND-UI-001"],
      },
      shenanigan: {
        Governance: ["SHEN-GOV-001"],
        Runway: ["SHEN-PRODUCT-002", "SHEN-CONTRIB-001"],
        Archive: ["SHEN-DOC-001", "SHEN-HISTORY-001"],
      },
      brightid: {
        Journey: ["BRIGHTID-UI-002"],
        Implementation: ["BRIGHTID-CODE-001"],
        Operations: ["BRIGHTID-INFRA-001"],
      },
      "open-source": {
        "Product UI": ["OSS-SC-PR-001", "OSS-HNY-PR-001"],
        "Identity + protocol": ["OSS-BID-PR-001", "OSS-COL-PR-001"],
        Attribution: ["OSS-MARK-STRIP-001"],
      },
    };

    projects.forEach((project) => {
      const { container, unmount } = render(
        <MemoryRouter><ProjectPage project={project} Content={Content} /></MemoryRouter>,
      );

      for (const [phase, candidateIds] of Object.entries(expectedPairings[project.slug])) {
        const chapter = [...container.querySelectorAll<HTMLElement>("[data-evidence-phase]")]
          .find((candidate) => candidate.dataset.evidencePhase === phase)!;
        const actual = [...chapter.querySelectorAll("[data-candidate-id]")]
          .map((node) => node.getAttribute("data-candidate-id"));
        expect(actual).toEqual(candidateIds);
      }
      unmount();
    });
  });
});
