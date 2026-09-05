import { cleanup, render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, describe, expect, it } from "vitest";
import { ProjectPage } from "~/components/project-page";
import { projects } from "~/data/site";

afterEach(cleanup);

describe("case studies", () => {
  it("uses a screenshot-led account of Victor's complete project scope", () => {
    for (const project of projects) {
      const { container, unmount } = render(
        <RouterProvider router={createMemoryRouter([{ path: "/", element: <ProjectPage project={project} /> }])} />,
      );

      expect(screen.getByRole("img", { name: project.screenshot.alt })).toHaveAttribute("src", project.screenshot.src);
      expect(screen.getByRole("link", { name: `Visit the website shown for ${project.title}` })).toHaveAttribute(
        "href",
        project.screenshot.href,
      );
      expect(screen.getByRole("heading", { name: "What Victor built" })).toBeInTheDocument();
      expect(container.querySelectorAll(".contribution-list > li")).toHaveLength(project.contributions.length);
      for (const contribution of project.contributions) {
        expect(screen.getByRole("heading", { name: contribution.title })).toBeInTheDocument();
        expect(container).toHaveTextContent(contribution.detail);
      }
      expect(container).not.toHaveTextContent(/the challenge|victor's contribution|the result/i);
      expect(container.querySelector(".metric-band")).not.toBeInTheDocument();
      expect(container).not.toHaveTextContent("Scope of work");
      expect(screen.getByRole("heading", { name: "Project links" })).toBeInTheDocument();
      unmount();
    }
  });

  it("keeps internal review vocabulary out of the story", () => {
    const { container } = render(<RouterProvider router={createMemoryRouter([{ path: "/", element: <ProjectPage project={projects[0]} /> }])} />);

    expect(container.querySelector("[data-candidate-id]")).not.toBeInTheDocument();
    expect(container).not.toHaveTextContent(/commit|agent-approved|human-pending|rights holder|privacy review/i);
  });

  it("keeps each case study concise and ends with live project links", () => {
    for (const project of projects) {
      const { container, unmount } = render(
        <RouterProvider router={createMemoryRouter([{ path: "/", element: <ProjectPage project={project} /> }])} />,
      );
      const words = (container.textContent ?? "").trim().split(/\s+/);

      expect(words.length).toBeLessThan(260);
      const links = within(container).getAllByRole("link");
      expect(links.some((link) => link.getAttribute("href") === project.links[0].href)).toBe(true);
      unmount();
    }
  });
});
