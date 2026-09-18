import { expect, test } from "@playwright/test";

test("project screenshots load WebP while social previews keep JPEG URLs", async ({ page }) => {
  await page.goto("/");
  const screenshots = page.getByRole("link", { name: /Visit the website shown for/ }).getByRole("img");
  await expect(screenshots).toHaveCount(4);
  for (const image of await screenshots.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(element => {
      const img = element as HTMLImageElement;
      return img.complete && img.naturalWidth > 0 && new URL(img.currentSrc).pathname.endsWith(".webp");
    })).toBe(true);
  }
  for (const slug of ["send", "shenanigan", "brightid", "open-source"]) {
    await page.goto(`/work/${slug}`);
    const image = page.getByRole("link", { name: /Visit the website shown for/ }).getByRole("img");
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate(element => {
      const img = element as HTMLImageElement;
      return img.complete && img.naturalWidth > 0 && new URL(img.currentSrc).pathname.endsWith(".webp");
    })).toBe(true);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\.jpg$/);
    await expect(page.locator('meta[property="og:image:type"]')).toHaveAttribute("content", "image/jpeg");
  }
});
