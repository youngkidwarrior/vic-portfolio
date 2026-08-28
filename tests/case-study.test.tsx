import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { ProjectPage } from "~/components/project-page";
import { projects } from "~/data/site";

afterEach(cleanup);

describe("Campaign 4 case studies", () => {
  it("uses a screenshot-led Challenge / Contribution / Result story", () => {
    for (const project of projects) {
      const { container, unmount } = render(
        <MemoryRouter><ProjectPage project={project} /></MemoryRouter>,
      );

      expect(screen.getByRole("img", { name: project.screenshot.alt })).toHaveAttribute("src", project.screenshot.src);
      expect(screen.getByRole("link", { name: `Visit the website shown for ${project.title}` })).toHaveAttribute(
        "href",
        project.screenshot.href,
      );
      expect(screen.getByRole("heading", { name: "The challenge" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Victor's contribution" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "The result" })).toBeInTheDocument();
      expect(container.querySelectorAll(".metric-band > div")).toHaveLength(2);
      unmount();
    }
  });

  it("removes public audit and implementation details", () => {
    const { container } = render(<MemoryRouter><ProjectPage project={projects[0]} /></MemoryRouter>);

    expect(container.querySelector(".expanded-proof")).not.toBeInTheDocument();
    expect(container.querySelector(".ownership-panel")).not.toBeInTheDocument();
    expect(container.querySelector(".evidence-sequence")).not.toBeInTheDocument();
    expect(container.querySelector("[data-candidate-id]")).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(/commit|agent-approved|human-pending|rights holder|privacy review/i);
  });

  it("keeps each case study concise and ends with live project links", () => {
    for (const project of projects) {
      const { container, unmount } = render(
        <MemoryRouter><ProjectPage project={project} /></MemoryRouter>,
      );
      const words = (container.textContent ?? "").trim().split(/\s+/);

      expect(words.length).toBeLessThan(180);
      const links = within(container).getAllByRole("link");
      expect(links.some((link) => link.getAttribute("href") === project.links[0].href)).toBe(true);
      unmount();
    }
  });
});
