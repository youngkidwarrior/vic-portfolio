import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Home from "~/routes/home";

vi.mock("~/components/project-row", () => ({ ProjectRow: () => null }));
vi.mock("~/components/reveal", () => ({
  Reveal: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

afterEach(cleanup);

describe("Campaign 4 homepage", () => {
  it("leads with a concise, plain-language offer", () => {
    const { container } = render(<Home />);
    const hero = container.querySelector(".hero");

    expect(hero).not.toBeNull();
    const heroQueries = within(hero as HTMLElement);
    expect(heroQueries.getByRole("heading", { level: 1 })).toHaveTextContent("I make complex products feel simple.");
    expect(heroQueries.getByText(/payments, identity, and mobile products/i)).toBeInTheDocument();
    expect(heroQueries.getByRole("link", { name: /View my work/i })).toHaveAttribute("href", "#work");
    expect(heroQueries.getByRole("link", { name: /Start a conversation/i })).toHaveAttribute(
      "href",
      "mailto:victor@she.energy",
    );
  });

  it("removes internal evidence machinery and repeated taxonomy", () => {
    const { container } = render(<Home />);

    expect(container.querySelector(".hero-proof-stage")).not.toBeInTheDocument();
    expect(container.querySelector(".signal-band")).not.toBeInTheDocument();
    expect(container.querySelector(".systems-section")).not.toBeInTheDocument();
    expect(container.querySelector(".recognition-dossier")).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(/agent-approved|human-pending|candidate|owner-attested/i);
  });

  it("keeps one compact award, a short introduction, and Victor's portrait", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { level: 2, name: "Winner, Aragon Hack for Freedom" })).toBeInTheDocument();
    expect(screen.getByText(/founder and product engineer who works across design/i)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Portrait of Victor Ginelli" })).toHaveAttribute(
      "src",
      "/images/victor-portrait.webp",
    );
  });
});
