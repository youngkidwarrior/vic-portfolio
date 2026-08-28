import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/work/send", "/work/shenanigan", "/work/brightid", "/work/open-source", "/resume"];
const caseStudyRoutes = routes.filter((route) => route.startsWith("/work/"));

function seriousViolations(results: Awaited<ReturnType<AxeBuilder["analyze"]>>) {
  return results.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");
}

for (const route of routes) {
  test(`${route} renders without serious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    expect(seriousViolations(results)).toEqual([]);
  });

  test(`${route} renders without runtime failures or broken local images`, async ({ page }) => {
    const failures: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") failures.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => failures.push(`page: ${error.message}`));
    page.on("requestfailed", (request) => {
      if (request.url().startsWith("http://127.0.0.1:4173")) {
        failures.push(`request: ${request.url()} (${request.failure()?.errorText ?? "unknown"})`);
      }
    });

    const response = await page.goto(route);
    expect(response?.ok()).toBe(true);
    await expect(page.locator("h1")).toHaveCount(1);

    for (const image of await page.locator("img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty("complete", true);
      expect(await image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }

    expect(failures).toEqual([]);
  });
}

test("primary journey reaches a case study and returns", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Read the story" }).first().click();
  await expect(page).toHaveURL(/\/work\/send$/);
  await expect(page.getByRole("heading", { level: 1, name: "Send" })).toBeVisible();
  await page.getByRole("link", { name: "All work" }).click();
  await expect(page).toHaveURL(/\/#work$/);
});

test("theme selection persists across navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.goto("/resume");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

for (const route of routes) {
  test(`${route} dark theme remains accessible`, async ({ page }) => {
    await page.goto(route);
    const themeButton = page.getByRole("button", { name: /Switch to (dark|light) theme/ });
    if ((await page.locator("html").getAttribute("data-theme")) !== "dark") await themeButton.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    const results = await new AxeBuilder({ page }).analyze();
    expect(seriousViolations(results)).toEqual([]);
  });
}

test("reduced motion keeps the primary content visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Start a conversation" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Four products, clearly told." })).toBeAttached();
});

for (const route of caseStudyRoutes) {
  test(`${route} foregrounds a concise project story with reduced motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await expect(page.getByRole("img").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "The challenge" })).toBeAttached();
    await expect(page.getByRole("heading", { name: "Victor's contribution" })).toBeAttached();
    await expect(page.getByRole("heading", { name: "The result" })).toBeAttached();
  });
}

for (const width of [320, 390, 620, 621, 900, 901]) {
  test(`every route has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scrollWidth, `${route} overflows at ${width}px`).toBeLessThanOrEqual(dimensions.clientWidth);
    }
  });
}

test("the PDF resume is available", async ({ request }) => {
  const response = await request.get("/victor-ginelli-resume.pdf");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
});

test("mobile navigation opens and exposes all destinations", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "Mobile-only interaction");
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Work", exact: true })).toBeFocused();
  await expect(page.getByRole("link", { name: "Resume", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Toggle navigation" })).toBeFocused();
  await expect(page.getByRole("button", { name: "Toggle navigation" })).toHaveAttribute("aria-expanded", "false");
});

test("the built site does not expose private resume data", async ({ page }) => {
  await page.goto("/resume");
  await expect(page.locator("body")).not.toContainText("626");
  await expect(page.locator("body")).not.toContainText("808-7834");
});
