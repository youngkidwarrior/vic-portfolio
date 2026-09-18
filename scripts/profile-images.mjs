import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";

const url = process.env.TARGET_URL ?? "http://127.0.0.1:8000/";
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, serviceWorkers: "block" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.clearBrowserCache");

  const snapshot = () => page.evaluate(() => {
    const resources = performance.getEntriesByType("resource")
      .filter(entry => new URL(entry.name).origin === location.origin)
      .map(entry => ({ path: new URL(entry.name).pathname, bytes: entry.encodedBodySize, transferBytes: entry.transferSize }));
    const images = resources.filter(entry => /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(entry.path));
    const uniqueImages = [...new Map(images.map(entry => [entry.path, entry])).values()];
    return {
      resourceBodyBytes: resources.reduce((sum, entry) => sum + entry.bytes, 0),
      imageBodyBytes: images.reduce((sum, entry) => sum + entry.bytes, 0),
      uniqueImageBodyBytes: uniqueImages.reduce((sum, entry) => sum + entry.bytes, 0),
      images,
    };
  });

  await page.goto(url);
  await page.waitForLoadState("networkidle");
  const initial = await snapshot();
  const screenshots = page.getByRole("link", { name: /Visit the website shown for/ }).getByRole("img");
  if (await screenshots.count() !== 4) throw new Error("Expected all four project screenshots");
  for (const screenshot of await screenshots.all()) {
    await screenshot.scrollIntoViewIfNeeded();
    await screenshot.evaluate(image => image.decode());
    await page.waitForLoadState("networkidle");
  }
  const fullScroll = await snapshot();
  if (errors.length) throw new Error(errors.join("; "));
  const report = {
    url, browser: browser.version(), recordedAt: new Date().toISOString(),
    viewport: page.viewportSize(), cacheDisabled: true,
    note: "Same-origin resource bodies; excludes HTML, headers and third-party preview tooling. Repeated requests count in totals; unique images count each URL once.",
    initial, fullScroll,
  };
  const output = process.env.REPORT_PATH ?? "/tmp/portfolio-image-transfer.json";
  await writeFile(output, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
