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

describe("selected work", () => {
  it("gives every project one authentic screenshot and one concise composition", () => {
    const { container } = render(
      <MemoryRouter>
        {projects.map((project, index) => <ProjectRow key={project.slug} project={project} priority={index === 0} />)}
      </MemoryRouter>,
    );

    expect(container.querySelectorAll("[data-composition='project-showcase']")).toHaveLength(4);
    expect(screen.getAllByRole("img")).toHaveLength(4);
    for (const project of projects) {
      expect(screen.getByRole("img", { name: project.screenshot.alt })).toHaveAttribute("src", project.screenshot.src);
    }
  });

  it("shows each project's full contribution scope without a separate metrics treatment", () => {
    const { container } = render(
      <MemoryRouter>
        {projects.map((project, index) => <ProjectRow key={project.slug} project={project} priority={index === 0} />)}
      </MemoryRouter>,
    );

    expect(container.querySelector(".metric-line")).not.toBeInTheDocument();
    for (const project of projects) {
      const projectSection = screen.getByRole("heading", { name: project.title }).closest(".simple-project");
      expect(projectSection?.querySelectorAll(".project-contributions > li")).toHaveLength(project.contributions.length);
      for (const contribution of project.contributions) {
        expect(projectSection).toHaveTextContent(contribution.title);
      }
    }
    expect(container.querySelector("[data-candidate-id]")).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(/agent-approved|human-pending|primary record|source-linked/i);
    expect(container.querySelector("[data-project-sequence]")).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(/\b0[1-9]\s*\/\s*20\d{2}/);
    expect(container).not.toHaveTextContent(/challenge|contribution:/i);
  });

  it("uses the screenshot as the live-project action and offers project details", () => {
    render(
      <MemoryRouter>
        {projects.map((project, index) => <ProjectRow key={project.slug} project={project} priority={index === 0} />)}
      </MemoryRouter>,
    );

    for (const project of projects) {
      expect(screen.getByRole("link", { name: `Visit the website shown for ${project.title}` })).toHaveAttribute(
        "href",
        project.screenshot.href,
      );
      const section = screen.getByRole("heading", { name: project.title }).closest(".simple-project");
      expect(section).not.toHaveTextContent("Visit project");
      expect(section).toHaveTextContent("Project details");
    }
  });
});
