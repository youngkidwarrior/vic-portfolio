import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";
import { SiteHeader } from "~/components/site-header";
import { ThemeToggle } from "~/components/theme-toggle";

const visibleCopyFiles = [
  "app/data/site.ts",
  "app/routes/home.tsx",
  "app/routes/resume.tsx",
  "app/root.tsx",
  "app/components/site-header.tsx",
  "app/components/site-footer.tsx",
  "app/components/case-study/ownership-panel.tsx",
  "app/components/selected-work/shenanigan-archive.tsx",
  ...readdirSync("app/content").map((file) => join("app/content", file)),
];

describe("site copy and chrome", () => {
  afterEach(() => {
    document.documentElement.dataset.theme = "light";
    localStorage.clear();
  });

  it("keeps visible model and content copy free of en and em dashes", () => {
    for (const file of visibleCopyFiles) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(/[–—]/);
    }
  });

  it("keeps the removed kinetic treatment out of application imports", () => {
    const applicationFiles = readdirSync("app", { recursive: true })
      .map(String)
      .filter((file) => /\.(?:ts|tsx)$/.test(file));

    for (const file of applicationFiles) {
      const source = readFileSync(join("app", file), "utf8");
      expect(source, String(file)).not.toMatch(/KineticArt|kinetic-art/);
    }
  });

  it("moves focus into the mobile menu and restores it when Escape closes", async () => {
    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    );

    const toggle = screen.getByRole("button", { name: "Toggle navigation" });
    expect(toggle).toHaveAttribute("aria-controls", "primary-navigation");
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);

    await waitFor(() => expect(screen.getByRole("link", { name: "Work" })).toHaveFocus());
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => expect(toggle).toHaveAttribute("aria-expanded", "false"));
    expect(toggle).toHaveFocus();
  });

  it("announces the theme implied by the initialized document", async () => {
    document.documentElement.dataset.theme = "dark";
    render(<ThemeToggle />);

    expect(await screen.findByRole("button", { name: "Switch to light theme" })).toBeVisible();
  });
});
