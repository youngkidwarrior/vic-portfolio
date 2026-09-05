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

test("Convergence assembles around a fixed hub and holds beyond the study loop", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const art = page.locator(".hero-convergence");
  await expect(art).toBeVisible();
  await art.scrollIntoViewIfNeeded();
  const samples = await art.evaluate(async (element) => {
    const frames: { time: number; bands: { x: number; opacity: number }[]; hubTransform: string; hubOpacity: string }[] = [];
    const start = performance.now();
    await new Promise<void>((resolve) => {
      const sample = () => {
        const hub = getComputedStyle(element.querySelector(".convergence-hub")!);
        frames.push({ time: performance.now() - start,
          bands: Array.from(element.querySelectorAll(".convergence-band")).map((band) => {
            const style = getComputedStyle(band);
            return { x: new DOMMatrixReadOnly(style.transform).m41, opacity: Number(style.opacity) };
          }), hubTransform: hub.transform, hubOpacity: hub.opacity });
        if (performance.now() - start < 6500) requestAnimationFrame(sample);
        else resolve();
      };
      requestAnimationFrame(sample);
    });
    return frames;
  });
  expect(samples.some((frame) => frame.bands.some((band) => Math.abs(band.x) > 1))).toBe(true);
  expect(samples.every((frame) => frame.hubTransform === "none" && frame.hubOpacity === "1")).toBe(true);
  const held = samples.filter((frame) => frame.time > 3500);
  expect(held.length).toBeGreaterThan(0);
  expect(held.every((frame) => frame.bands.length === 4 && frame.bands.every((band) => Math.abs(band.x) < 0.1 && band.opacity === 1))).toBe(true);
  await expect(page.getByRole("heading", { level: 1, name: "Victor Ginelli" })).toBeVisible();
});

test("reduced motion completes Convergence immediately without replaying it", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const art = page.locator(".hero-convergence");
  await art.scrollIntoViewIfNeeded();
  await expect.poll(async () => Math.abs((await translation(page.locator(".convergence-green"))).x)).toBeGreaterThan(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const band of await page.locator(".convergence-band").all()) {
    await expect(band).toHaveCSS("transform", "none");
    await expect(band).toHaveCSS("opacity", "1");
  }
  await expect(page.locator(".convergence-rest")).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const held = await art.evaluate(async (element) => {
    const start = performance.now();
    return new Promise<string[]>((resolve) => {
      const sample = () => {
        const changed = Array.from(element.querySelectorAll(".convergence-band, .convergence-rest")).flatMap((layer) => {
          const style = getComputedStyle(layer);
          return Number(style.opacity) < 1 || Math.abs(new DOMMatrixReadOnly(style.transform).m41) > 0.1
            ? [`${layer.classList}: opacity=${style.opacity}; transform=${style.transform}; attributes=${layer.getAttribute("opacity")}/${layer.getAttribute("transform")}`] : [];
        });
        if (changed.length) resolve(changed);
        else if (performance.now() - start >= 2000) resolve([]);
        else requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
  });
  expect(held).toEqual([]);
});

test("generated artwork visibly frames the hero and every project", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const loadedArt = new Set<string>();
  page.on("response", (response) => {
    if (response.ok() && response.url().includes("/images/art/")) loadedArt.add(new URL(response.url()).pathname);
  });
  await page.goto("/");
  await expect(page.locator("[data-artwork]")).toHaveCount(5);
  for (const slug of ["hero", "send", "shenanigan", "brightid", "open-source"]) {
    const artwork = page.locator(`[data-artwork="${slug}"]`);
    await artwork.scrollIntoViewIfNeeded();
    await expect(artwork).toBeInViewport();
    await expect(artwork).toBeVisible();
    await expect.poll(() => loadedArt.has(`/images/art/${slug}-poster.webp`)).toBe(true);
  }
});

test("each completed project print stays assembled when scrolling and its screenshot stays flat", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  for (const slug of ["send", "shenanigan", "brightid", "open-source"]) {
    const artwork = page.locator(`[data-artwork="${slug}"]`);
    await artwork.scrollIntoViewIfNeeded();
    await expect.poll(() => isReadable(artwork)).toBe(true);
    const media = artwork.locator("[data-art-layer]");
    const transforms = () => media.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).transform).join("|"));
    const replay = artwork.getByRole("button", { name: /Replay/ });
    await replay.click();
    await expect.poll(() => media.first().evaluate(element => Number(getComputedStyle(element).opacity))).toBeLessThan(0.99);
    for (const layer of await media.all()) await expect(layer).toHaveCSS("opacity", "1");
    const initial = await transforms();
    await page.evaluate(() => window.scrollBy({ top: 100, behavior: "instant" }));
    await expect.poll(transforms).toBe(initial);
    await expect(artwork.locator("..").getByRole("img")).toHaveCSS("transform", "none");
  }
});

test("portrait ink follows the pointer and returns while the photograph stays still", async ({ page, isMobile }) => {
  test.skip(Boolean(isMobile), "Fine-pointer interaction");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
  const portrait = page.getByRole("img", { name: "Portrait of Victor Ginelli" });
  const ink = page.locator(".portrait-ink-blue");
  const artwork = page.locator(".hero-art-plane");
  const initial = await translation(ink);
  const bounds = await portrait.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width * 0.8, bounds!.y + bounds!.height * 0.3);
  await expect.poll(async () => (await translation(ink)).x - initial.x).toBeGreaterThan(5);
  await expect(artwork).toHaveCSS("transform", "none");
  await expect(portrait).toHaveCSS("transform", "none");
  await page.mouse.move(10, 10);
  await expect.poll(async () => Math.abs((await translation(ink)).x - initial.x)).toBeLessThan(0.5);
  await expect(artwork).toHaveCSS("transform", "none");
});

test("touch scrolling moves portrait ink without tilting the photograph", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Touch scroll equivalent");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const ink = page.locator(".portrait-ink-blue");
  const artwork = page.locator(".hero-art-plane");
  const initial = await translation(ink);
  await page.evaluate(() => window.scrollTo({ top: 220, behavior: "instant" }));
  await expect.poll(async () => Math.abs((await translation(ink)).y - initial.y)).toBeGreaterThan(1);
  await expect(artwork).toHaveCSS("transform", "none");
  await expect(page.getByRole("img", { name: "Portrait of Victor Ginelli" })).toHaveCSS("transform", "none");
});

test("enabling reduced motion resets interactive layers and reveals all content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".portrait-ink-blue")).toHaveCSS("transform", "none");
  await expect(page.locator(".hero-art-plane")).toHaveCSS("transform", "none");
  for (const media of await page.locator("[data-art-media]").all()) {
    await expect(media).toHaveCSS("transform", "none");
  }
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
  await expect.poll(async () => Math.abs((await translation(page.locator(".project-copy").first())).y)).toBeLessThan(0.1);
  const originUrl = page.url();
  const originScroll = await page.evaluate(() => window.scrollY);
  await details.click();
  await expect(page.getByRole("heading", { level: 1, name: "Send" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("heading", { level: 1, name: "Send" })).toBeInViewport();
  await page.getByRole("link", { name: "All work" }).click();
  await expect(page).toHaveURL(originUrl);
  await expect.poll(async () => Math.abs(await page.evaluate(() => window.scrollY) - originScroll)).toBeLessThan(2);
  await expect(details).toBeInViewport();
  await expect.poll(() => isReadable(details)).toBe(true);
});

test.describe("motion review", () => {
  test("records the portrait, project sequence, and theme states", async ({ page, isMobile }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const portrait = page.getByRole("img", { name: "Portrait of Victor Ginelli" });
    await expect(portrait).toHaveJSProperty("complete", true);
    await page.locator(".hero-convergence").scrollIntoViewIfNeeded();
    await expect.poll(async () => Math.abs((await translation(page.locator(".convergence-green"))).x)).toBeLessThan(0.1);
    await expect(page.locator(".convergence-rest")).toHaveCSS("opacity", "1");
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
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
    await page.getByRole("link", { name: "All work" }).click();
    await expect(page.getByRole("heading", { name: "My recent highlights" })).toBeAttached();
    await page.evaluate(async () => {
      await Promise.all(document.getAnimations().filter((animation) =>
        animation.effect instanceof KeyframeEffect && animation.effect.pseudoElement?.startsWith("::view-transition"),
      ).map((animation) => animation.finished));
    });
    for (const slug of ["send", "shenanigan", "brightid", "open-source"]) {
      const artwork = page.locator(`[data-artwork="${slug}"]`);
      const row = page.locator(".project-row").filter({ has: artwork });
      await row.getByRole("link", { name: "Project details" }).scrollIntoViewIfNeeded();
      await expect.poll(() => isReadable(row.getByRole("link", { name: "Project details" }))).toBe(true);
      await artwork.scrollIntoViewIfNeeded();
      await expect.poll(() => isReadable(artwork)).toBe(true);
      for (const layer of await artwork.locator("[data-art-layer]").all()) await expect(layer).toHaveCSS("opacity", "1");
      await row.screenshot({ path: testInfo.outputPath(`${slug}-chapter.png`) });
    }
  });
});
