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
  it("leads with Victor, his portrait, introduction, and resume", () => {
    const { container } = render(<Home />);
    const hero = container.querySelector(".hero");

    expect(hero).not.toBeNull();
    const heroQueries = within(hero as HTMLElement);
    expect(heroQueries.getByRole("heading", { level: 1 })).toHaveTextContent("Victor Ginelli");
    expect(heroQueries.getByText(/founder and full-stack product engineer/i)).toBeInTheDocument();
    expect(heroQueries.getByRole("img", { name: "Portrait of Victor Ginelli" })).toHaveAttribute(
      "src",
      "/images/victor-portrait.webp",
    );
    expect(heroQueries.getByText("I’ve spent the last eight years building across the stack, turning ambitious ideas into products people can actually use.")).toBeInTheDocument();
    expect(heroQueries.getByRole("link", { name: /View résumé/i })).toHaveAttribute("href", "/resume");
    expect(heroQueries.getByRole("link", { name: /See highlights/i })).toHaveAttribute("href", "#work");
  });

  it("keeps the homepage vocabulary visitor-facing", () => {
    const { container } = render(<Home />);

    expect(container).not.toHaveTextContent(/agent-approved|human-pending|candidate|owner-attested/i);
  });

  it("keeps one compact award without repeating the About section", () => {
    const { container } = render(<Home />);

    expect(screen.getByRole("heading", { level: 2, name: "Winner, Aragon Hack for Freedom" })).toBeInTheDocument();
    expect(container.querySelectorAll("#about")).toHaveLength(1);
    expect(screen.getAllByRole("img", { name: "Portrait of Victor Ginelli" })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 2, name: "My recent highlights" })).toBeInTheDocument();
    expect(container).not.toHaveTextContent(/Selected work|Four products, clearly told/i);
  });
});
