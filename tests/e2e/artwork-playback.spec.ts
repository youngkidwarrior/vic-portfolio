import { expect, test } from "@playwright/test";

test.use({ video: process.env.MOTION_REVIEW ? "on" : "retain-on-failure" });

test("enlarged artwork stays in the background without displacing primary content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const art = await page.locator(".hero-convergence").boundingBox();
  const portrait = await page.getByRole("img", { name: "Portrait of Victor Ginelli" }).boundingBox();
  expect(art).not.toBeNull();
  expect(portrait).not.toBeNull();
  expect(art!.width).toBeGreaterThan(portrait!.width * 1.5);
  await expect(page.locator('[data-artwork="hero"]')).toHaveCSS("position", "absolute");
  for (const media of await page.locator(".project-media").all()) {
    await expect(media.locator(".project-art")).toHaveCSS("position", "absolute");
    const mediaBox = await media.boundingBox();
    const screenshot = await media.getByRole("img").boundingBox();
    expect(Math.abs(mediaBox!.height - screenshot!.height)).toBeLessThan(1);
  }
});

test("artwork plays at a fixed scroll position, replays, and settles", async ({ page, isMobile }, testInfo) => {
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  for (const slug of ["hero", "send", "shenanigan", "brightid", "open-source"]) {
    const art = page.locator(`[data-artwork="${slug}"]`);
    const replay = art.getByRole("button", { name: /Replay/ });
    await replay.evaluate(element => element.scrollIntoView({ block: "end", behavior: "instant" }));
    await expect(replay).toBeEnabled();
    await expect.poll(() => art.evaluate(element => {
      const reveal = element.closest(".reveal-motion");
      if (!reveal) return true;
      const style = getComputedStyle(reveal);
      return Number(style.opacity) === 1 && Math.abs(new DOMMatrixReadOnly(style.transform).m42) < 0.1;
    })).toBe(true);
    // Locator.click also asks Chromium to scroll, which smooth-scrolls even when
    // the control is already visible. Use real pointer input for a stationary take.
    const button = await replay.boundingBox();
    expect(button).not.toBeNull();
    const point = { x: button!.x + button!.width / 2, y: button!.y + button!.height / 2 };
    if (isMobile) await page.touchscreen.tap(point.x, point.y);
    else await page.mouse.click(point.x, point.y);
    const frames = await art.evaluate(async element => {
      const frames: { y: number; transforms: string[]; opacities: number[] }[] = [];
      const start = performance.now();
      await new Promise<void>(resolve => {
        const sample = () => {
          const styles = [...element.querySelectorAll("[data-art-layer]")].map(layer => getComputedStyle(layer));
          frames.push({ y: scrollY, transforms: styles.map(style => style.transform), opacities: styles.map(style => Number(style.opacity)) });
          if (performance.now() - start < 3800) requestAnimationFrame(sample);
          else resolve();
        };
        requestAnimationFrame(sample);
      });
      return frames;
    });
    expect(new Set(frames.map(frame => frame.y)).size).toBe(1);
    expect(new Set(frames.map(frame => frame.transforms.join("|"))).size).toBeGreaterThan(15);
    expect(frames.at(-1)!.opacities.every(opacity => opacity === 1)).toBe(true);
    await expect(art).toBeInViewport();
    if (process.env.MOTION_REVIEW) await art.screenshot({ path: testInfo.outputPath(`${slug}-held.png`) });
  }
});

test("reduced motion settles artwork and removes playback controls", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const art = page.locator('[data-artwork="send"]');
  const replay = art.getByRole("button", { name: /Replay/ });
  await replay.scrollIntoViewIfNeeded();
  await replay.click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("button", { name: /Replay/ })).toHaveCount(0);
  for (const layer of await page.locator("[data-art-layer]").all()) {
    await expect(layer).toHaveCSS("transform", "none");
    await expect(layer).toHaveCSS("opacity", "1");
  }
});
