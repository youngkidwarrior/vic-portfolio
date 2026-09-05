import { expect, test, type Locator } from "@playwright/test";

test.use({ video: process.env.MOTION_REVIEW ? "on" : "retain-on-failure" });

const translation = (locator: Locator) => locator.evaluate((element) => {
  const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
  return { x: matrix.m41, y: matrix.m42 };
});

async function isReadable(locator: Locator) {
  return locator.evaluate((element) => {
    for (let node: Element | null = element; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (Number(style.opacity) < 0.99 || style.visibility === "hidden") return false;
    }
    return true;
  });
}

test("portrait ink follows the pointer and returns while the photograph stays still", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "Fine-pointer interaction");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
  const portrait = page.getByRole("img", { name: "Portrait of Victor Ginelli" });
  const ink = page.locator(".portrait-ink-blue");
  const initial = await translation(ink);
  const bounds = await portrait.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width * 0.8, bounds!.y + bounds!.height * 0.3);
  await expect.poll(async () => (await translation(ink)).x - initial.x).toBeGreaterThan(5);
  await expect(portrait).toHaveCSS("transform", "none");
  await page.mouse.move(10, 10);
  await expect.poll(async () => Math.abs((await translation(ink)).x - initial.x)).toBeLessThan(0.5);
});

test("touch scrolling moves portrait ink without tilting the photograph", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Touch scroll equivalent");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const ink = page.locator(".portrait-ink-blue");
  const initial = await translation(ink);
  await page.evaluate(() => window.scrollTo({ top: 220, behavior: "instant" }));
  await expect.poll(async () => Math.abs((await translation(ink)).y - initial.y)).toBeGreaterThan(1);
  await expect(page.getByRole("img", { name: "Portrait of Victor Ginelli" })).toHaveCSS("transform", "none");
});

test("enabling reduced motion resets interactive layers and reveals all content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".portrait-ink-blue")).toHaveCSS("transform", "none");
  for (const reveal of await page.locator(".reveal-motion").all()) {
    await expect(reveal).toHaveCSS("opacity", "1");
    await expect(reveal).toHaveCSS("transform", "none");
  }
  await page.evaluate(() => window.scrollTo({ top: 240, behavior: "instant" }));
  await expect(page.locator(".portrait-ink-blue")).toHaveCSS("transform", "none");
});

test("slow hydration never hides the already readable hero", async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route(/\/assets\/.*\.js$/, async (route) => { await held; await route.continue(); });
  try {
    await page.goto("/", { waitUntil: "commit" });
    const heading = page.getByRole("heading", { level: 1, name: "Victor Ginelli" });
    await expect(heading).toBeVisible();
    expect(await isReadable(heading)).toBe(true);
    release();
    await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
    expect(await isReadable(heading)).toBe(true);
  } finally { release(); }
});

test("project entrances finish and remain readable when navigating back", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const details = page.getByRole("link", { name: "Project details" }).first();
  await details.scrollIntoViewIfNeeded();
  await expect.poll(() => isReadable(details)).toBe(true);
  await details.click();
  await expect(page.getByRole("heading", { level: 1, name: "Send" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("heading", { level: 1, name: "Send" })).toBeInViewport();
  await page.getByRole("link", { name: "All work" }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect.poll(() => isReadable(page.getByRole("heading", { name: "My recent highlights" }))).toBe(true);
});

test.describe("motion review", () => {
  test("records the portrait, project sequence, and theme states", async ({ page, isMobile }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const portrait = page.getByRole("img", { name: "Portrait of Victor Ginelli" });
    await expect(portrait).toHaveJSProperty("complete", true);
    await page.screenshot({ path: testInfo.outputPath("hero-light.png") });
    if (!isMobile) {
      const bounds = await portrait.boundingBox();
      await page.mouse.move(bounds!.x + bounds!.width * 0.9, bounds!.y + 60, { steps: 24 });
      await expect.poll(async () => (await translation(page.locator(".portrait-ink-blue"))).x).toBeGreaterThan(5);
      await page.screenshot({ path: testInfo.outputPath("hero-pointer.png") });
    }
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await page.screenshot({ path: testInfo.outputPath("hero-dark.png") });
    await page.getByRole("button", { name: "Switch to light theme" }).click();
    await page.getByRole("link", { name: "See highlights" }).click();
    const details = page.getByRole("link", { name: "Project details" }).first();
    await details.scrollIntoViewIfNeeded();
    await expect.poll(() => isReadable(details)).toBe(true);
    await page.screenshot({ path: testInfo.outputPath("selected-work.png") });
    await details.click();
    await expect(page.getByRole("heading", { level: 1, name: "Send" })).toBeVisible();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.getByRole("heading", { level: 1, name: "Send" })).toBeInViewport();
    await page.screenshot({ path: testInfo.outputPath("project-page.png") });
  });
});
