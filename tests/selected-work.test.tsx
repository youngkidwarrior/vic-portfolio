import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { ProjectRow } from "~/components/project-row";
import { projects } from "~/data/site";

vi.mock("~/components/reveal", () => ({
  Reveal: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <div className={className}>{children}</div>
  ),
}));

vi.mock("~/components/atmospheric-art", () => ({
  AtmosphericArt: () => <figure aria-hidden="true" data-testid="atmospheric-art" />,
}));

describe("selected-work evidence compositions", () => {
  it("uses a distinct composition family for every project slug", () => {
    const { container } = render(
      <MemoryRouter>
        {projects.map((project, index) => <ProjectRow key={project.slug} project={project} index={index} />)}
      </MemoryRouter>,
    );

    expect([...container.querySelectorAll("[data-composition]")].map((node) => node.getAttribute("data-composition"))).toEqual([
      "send-product-stage",
      "shenanigan-archive-stack",
      "brightid-verification-path",
      "open-source-contribution-ledger",
    ]);
    expect(screen.getAllByTestId("atmospheric-art")).toHaveLength(4);
    expect(screen.getByText("Founder-built / community-owned")).toBeInTheDocument();
    expect(screen.getByLabelText("BrightID verification evidence path")).toBeInTheDocument();
  });

  it("links each open-source ledger row to its direct contribution record", () => {
    const project = projects.find((candidate) => candidate.slug === "open-source")!;
    const { container } = render(
      <MemoryRouter>
        <ProjectRow project={project} index={3} />
      </MemoryRouter>,
    );
    const ledger = container.querySelector("[data-composition='open-source-contribution-ledger']")!;
    const contributionLinks = within(ledger as HTMLElement).getAllByRole("link")
      .filter((link) => link.classList.contains("contribution-row"));

    expect(contributionLinks.map((link) => link.getAttribute("href"))).toEqual([
      "https://github.com/sourcecred/sourcecred/pull/2150",
      "https://github.com/1Hive/uniswap-interface/pull/30",
      "https://github.com/BrightID/brightid-python-sdk/pull/1",
      "https://github.com/JoinColony/colonyNetwork/pull/836",
    ]);
    for (const link of contributionLinks) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
      expect(link).toHaveTextContent("agent-approved / human-pending");
    }
  });
});
