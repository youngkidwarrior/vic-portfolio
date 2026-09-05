import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, expect, it, vi } from "vitest";
import { SiteHeader } from "~/components/site-header";
import Home from "~/routes/home";

vi.mock("~/components/project-row", () => ({ ProjectRow: () => null }));
vi.mock("~/components/reveal", () => ({
  Reveal: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

afterEach(cleanup);

function renderNavigation() {
  const router = createMemoryRouter([
    { path: "/", element: <><SiteHeader /><main id="main-content" tabIndex={-1}><Home /></main></> },
    { path: "/resume", element: <><SiteHeader /><main id="main-content" tabIndex={-1}>Resume</main></> },
  ], { initialEntries: ["/?view=highlights"] });
  render(<RouterProvider router={router} />);
  return router;
}

it("the hero section action preserves the query and creates a reversible Router entry", async () => {
  const router = renderNavigation();
  const originalKey = router.state.location.key;
  fireEvent.click(screen.getByRole("link", { name: "See highlights" }));
  await waitFor(() => expect(router.state.location.hash).toBe("#work"));
  expect(router.state.location.search).toBe("?view=highlights");
  expect(router.state.location.key).not.toBe(originalKey);
  await act(() => router.navigate(-1));
  await waitFor(() => expect(router.state.location.hash).toBe(""));
  expect(router.state.location.key).toBe(originalKey);
});

it("header navigation closes the menu and the skip link transfers focus through Router navigation", async () => {
  const router = renderNavigation();
  const menu = screen.getByRole("button", { name: "Toggle navigation" });
  fireEvent.click(menu);
  fireEvent.click(screen.getByRole("link", { name: "Work" }));
  await waitFor(() => expect(router.state.location.hash).toBe("#work"));
  expect(menu).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(screen.getByRole("link", { name: "Resume" }));
  await waitFor(() => expect(router.state.location.pathname).toBe("/resume"));
  fireEvent.click(screen.getByRole("link", { name: "Skip to content" }));
  await waitFor(() => expect(router.state.location.hash).toBe("#main-content"));
  expect(screen.getByRole("main")).toHaveFocus();
});
