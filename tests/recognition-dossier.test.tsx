import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RecognitionDossier } from "~/components/recognition-dossier";
import { recognition } from "~/data/site";
import Home from "~/routes/home";

vi.mock("~/components/atmospheric-art", () => ({ AtmosphericArt: () => null }));
vi.mock("~/components/product-proof", () => ({ ProductProof: () => null }));
vi.mock("~/components/project-row", () => ({ ProjectRow: () => null }));
vi.mock("~/components/reveal", () => ({
  Reveal: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

describe("recognition dossier", () => {
  it("distinguishes the owner-attested result from pending and public evidence", () => {
    render(<RecognitionDossier recognition={recognition} />);

    const award = screen.getByText("ARAGON-AWARD-001").closest("[data-candidate-id]");
    expect(award).toHaveAttribute("data-candidate-id", "ARAGON-AWARD-001");
    expect(award).toHaveTextContent("Owner-attested result");
    expect(award).toHaveTextContent("agent-approved");
    expect(award).toHaveTextContent("human-pending");
    expect(award).toHaveTextContent("exact-artifact-pending");

    expect(screen.getByRole("link", { name: /ARAGON-REC-001.*NFT Request submission/i })).toHaveAttribute(
      "href",
      "https://hackmd.io/@HADkohMGSyy8wLqA3Vdj6w/ryxO3Aqew",
    );
    expect(screen.getByRole("link", { name: /ARAGON-CODE-001.*Submission branch comparison/i })).toHaveAttribute(
      "href",
      "https://github.com/youngkidwarrior/token-request-app/compare/master...hack-for-freedom-submission",
    );
    expect(screen.getAllByText("agent-approved / human-pending")).toHaveLength(2);
    expect(screen.getByText(/current public sources verify the submission/i)).toBeInTheDocument();
    expect(screen.getByText(/forthcoming organizer artifact will supply result evidence/i)).toBeInTheDocument();
  });

  it("replaces the synthetic recognition mark and preserves the portrait", () => {
    const { container } = render(<Home />);
    const recognitionSection = container.querySelector(".recognition-section");

    expect(recognitionSection).not.toBeNull();
    expect(within(recognitionSection as HTMLElement).getByRole("heading", { level: 2 })).toHaveTextContent(
      "Winner, Aragon Hack for Freedom",
    );
    expect(recognitionSection).not.toHaveTextContent("HACK→SHIP");
    expect(container.querySelector(".recognition-mark")).not.toBeInTheDocument();

    const portrait = screen.getByRole("img", { name: "Portrait of Victor Ginelli" });
    expect(portrait).toHaveAttribute("src", "/images/victor-portrait.webp");
    expect(portrait.closest("figure")).toHaveClass("portrait-frame");
  });
});
