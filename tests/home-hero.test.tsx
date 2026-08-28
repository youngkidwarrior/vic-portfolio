import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "~/routes/home";

vi.mock("~/components/atmospheric-art", () => ({
  AtmosphericArt: ({ asset }: { asset: { role: string; ariaHidden: boolean } }) => (
    <div data-testid="hero-atmosphere" data-role={asset.role} aria-hidden={asset.ariaHidden} />
  ),
}));

vi.mock("~/components/product-proof", () => ({
  ProductProof: ({ asset, priority }: { asset: { candidateId: string; review: { agentApproval: string; humanApproval: string } }; priority: boolean }) => (
    <div data-testid="hero-proof" data-candidate-id={asset.candidateId} data-priority={priority}>
      {asset.review.agentApproval} {asset.review.humanApproval}
    </div>
  ),
}));

vi.mock("~/components/project-row", () => ({ ProjectRow: () => null }));
vi.mock("~/components/reveal", () => ({
  Reveal: ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>,
}));

describe("home documentary hero", () => {
  it("leads with provisional Send proof and keeps generated art atmospheric", () => {
    render(<Home />);

    expect(screen.getByTestId("hero-proof")).toHaveAttribute("data-candidate-id", "SEND-PROOF-001");
    expect(screen.getByTestId("hero-proof")).toHaveAttribute("data-priority", "true");
    expect(screen.getByTestId("hero-proof")).toHaveTextContent("agent-approved human-pending");
    expect(screen.getByTestId("hero-atmosphere")).toHaveAttribute("data-role", "decorative-atmosphere");
    expect(screen.getByTestId("hero-atmosphere")).toHaveAttribute("aria-hidden", "true");
  });

  it("makes selected work primary, resume secondary, and omits contact from the hero", () => {
    const { container } = render(<Home />);
    const hero = container.querySelector(".hero");

    expect(hero).not.toBeNull();
    const heroQueries = within(hero as HTMLElement);
    expect(heroQueries.getByRole("heading", { level: 1 })).toHaveTextContent("I turn hard systemsinto usable products.");
    expect(heroQueries.getByRole("link", { name: /View selected work/i })).toHaveAttribute("href", "#work");
    expect(heroQueries.getByRole("link", { name: /^Read resume/i })).toHaveAttribute("href", "/resume");
    expect(hero).not.toHaveTextContent("Start a conversation");
    expect(hero?.querySelector(".hero-rule")).not.toBeInTheDocument();
  });
});
