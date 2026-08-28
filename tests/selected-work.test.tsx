import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProjectRow } from "~/components/project-row";
import { projects } from "~/data/site";

vi.mock("~/components/reveal", () => ({
  Reveal: ({ children, className }: React.PropsWithChildren<{ className?: string }>) => (
    <div className={className}>{children}</div>
  ),
}));

afterEach(cleanup);

describe("Campaign 4 selected work", () => {
  it("gives every project one authentic screenshot and one concise composition", () => {
    const { container } = render(
      <MemoryRouter>
        {projects.map((project, index) => <ProjectRow key={project.slug} project={project} index={index} />)}
      </MemoryRouter>,
    );

    expect(container.querySelectorAll("[data-composition='project-showcase']")).toHaveLength(4);
    expect(screen.getAllByRole("img")).toHaveLength(4);
    for (const project of projects) {
      expect(screen.getByRole("img", { name: project.screenshot.alt })).toHaveAttribute("src", project.screenshot.src);
    }
  });

  it("limits every project to two outcomes and hides evidence metadata", () => {
    const { container } = render(
      <MemoryRouter>
        {projects.map((project, index) => <ProjectRow key={project.slug} project={project} index={index} />)}
      </MemoryRouter>,
    );

    for (const projectSection of container.querySelectorAll(".simple-project")) {
      expect(projectSection.querySelectorAll(".metric-line > div").length).toBeLessThanOrEqual(2);
    }
    expect(container.querySelector(".atmospheric-art")).not.toBeInTheDocument();
    expect(container.querySelector("[data-candidate-id]")).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(/agent-approved|human-pending|primary record|source-linked/i);
  });

  it("offers a direct live-project action for every project", () => {
    render(
      <MemoryRouter>
        {projects.map((project, index) => <ProjectRow key={project.slug} project={project} index={index} />)}
      </MemoryRouter>,
    );

    for (const project of projects) {
      expect(screen.getByRole("link", { name: `Visit ${project.title}` })).toHaveAttribute(
        "href",
        project.links[0].href,
      );
    }
  });
});
