import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/work/send", "/work/shenanigan", "/work/brightid", "/work/open-source", "/resume"];
const caseStudyRoutes = routes.filter((route) => route.startsWith("/work/"));
const socialPreviewRoutes = [
  { route: "/", canonicalUrl: "https://victor.she.energy/", imageUrl: "https://victor.she.energy/og.png" },
  { route: "/resume", canonicalUrl: "https://victor.she.energy/resume", imageUrl: "https://victor.she.energy/og.png" },
  { route: "/work/send", canonicalUrl: "https://victor.she.energy/work/send", imageUrl: "https://victor.she.energy/images/work/send.jpg" },
  { route: "/work/shenanigan", canonicalUrl: "https://victor.she.energy/work/shenanigan", imageUrl: "https://victor.she.energy/images/work/pants.jpg" },
  { route: "/work/brightid", canonicalUrl: "https://victor.she.energy/work/brightid", imageUrl: "https://victor.she.energy/images/work/brightid-bot.jpg" },
  { route: "/work/open-source", canonicalUrl: "https://victor.she.energy/work/open-source", imageUrl: "https://victor.she.energy/images/work/open-source.jpg" },
];

test.describe("prerendered content", () => {
  test.use({ javaScriptEnabled: false });
  test("project content remains readable without JavaScript", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("[data-artwork]")).toHaveCount(5);
    const content = [
      page.getByRole("heading", { name: "My recent highlights" }),
      ...await page.getByRole("link", { name: "Project details" }).all(),
    ];
    expect(content).toHaveLength(5);
    for (const element of content) {
      await expect(element).toBeVisible();
      // Playwright visibility alone accepts opacity: 0, so check the ancestors too.
      expect(await element.evaluate((element) => {
        for (let node: Element | null = element; node; node = node.parentElement) {
          if (getComputedStyle(node).opacity === "0") return false;
        }
        return true;
      })).toBe(true);
    }
  });
});

test("project reveal finishes with readable content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
  const recognition = page.getByRole("heading", { name: "Winner, Aragon Hack for Freedom" });
  await recognition.scrollIntoViewIfNeeded();
  await expect.poll(() => recognition.evaluate((heading) => heading.parentElement!.getAnimations().length)).toBeGreaterThan(0);
  await recognition.evaluate(async (heading) => {
    await Promise.all(heading.parentElement!.getAnimations().map((animation) => animation.finished));
  });
  await expect(recognition.locator("..")).toHaveCSS("opacity", "1");
  await expect(recognition.locator("..")).toHaveCSS("transform", "none");
});

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

  test(`${route} renders without runtime failures or broken local images`, async ({ page, baseURL }) => {
    const failures: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") failures.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => failures.push(`page: ${error.message}`));
    page.on("requestfailed", (request) => {
      if (new URL(request.url()).origin === new URL(baseURL!).origin) {
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

for (const { route, canonicalUrl, imageUrl } of socialPreviewRoutes) {
  test(`${route} prerenders complete social metadata`, async ({ request }) => {
    const response = await request.get(route);
    const html = await response.text();

    expect(response.ok()).toBe(true);
    expect(html).toContain(`<link rel="canonical" href="${canonicalUrl}"`);
    expect(html).toContain(`<meta property="og:url" content="${canonicalUrl}"`);
    expect(html).toContain(`<meta property="og:image" content="${imageUrl}"`);
    expect(html).toContain(`<meta property="og:image:secure_url" content="${imageUrl}"`);
    expect(html).toContain(`<meta name="twitter:card" content="summary_large_image"`);
    expect(html).toContain(`<meta name="twitter:image" content="${imageUrl}"`);
  });
}

test("primary journey reaches a case study and returns", async ({ page }) => {
  await page.goto("/");
  const originUrl = page.url();
  await page.getByRole("link", { name: "Project details" }).first().click();
  await expect(page).toHaveURL(/\/work\/send$/);
  await expect(page.getByRole("heading", { level: 1, name: "Send" })).toBeVisible();
  await page.getByRole("link", { name: "All work" }).click();
  await expect(page).toHaveURL(originUrl);
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
  await expect(page.getByRole("link", { name: "Get in touch" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "My recent highlights" })).toBeAttached();
});

for (const route of caseStudyRoutes) {
  test(`${route} foregrounds a concise project story with reduced motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await expect(page.getByRole("img").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "What Victor built" })).toBeAttached();
    await expect(page.getByRole("heading", { name: "Project links" })).toBeAttached();
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

for (const width of [320, 390]) {
  test(`display headings remain fully visible at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });

    for (const route of routes) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const headingBounds = await page.locator("h1, h2, h3, .footer-email").evaluateAll((headings) => {
        return headings.map((heading) => {
          const range = document.createRange();
          range.selectNodeContents(heading);
          const text = range.getBoundingClientRect();
          return {
            label: heading.textContent?.trim() ?? "heading",
            left: text.left,
            right: text.right,
            viewportWidth: window.innerWidth,
          };
        });
      });

      for (const heading of headingBounds) {
        expect(heading.left, `${route} ${heading.label} starts outside ${width}px`).toBeGreaterThanOrEqual(0);
        expect(heading.right, `${route} ${heading.label} is clipped at ${width}px`).toBeLessThanOrEqual(
          heading.viewportWidth,
        );
      }
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
