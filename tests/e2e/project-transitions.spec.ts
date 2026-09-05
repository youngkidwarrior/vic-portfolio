import { expect, test, type Page } from "@playwright/test";

type TransitionObservation = {
  oldNames: string[];
  newNames: string[];
  animationTargets: string[];
  durations: number[];
  ready: boolean;
  finished: boolean;
  error: string | null;
};

declare global {
  interface Window {
    __projectTransitions: TransitionObservation[];
  }
}

async function observeNativeTransitions(page: Page, unavailable = false) {
  await page.addInitScript(({ unavailable }) => {
    window.__projectTransitions = [];
    if (unavailable) {
      Object.defineProperty(document, "startViewTransition", { configurable: true, value: undefined });
      return;
    }
    const native = document.startViewTransition.bind(document);
    const names = () => Array.from(document.querySelectorAll("*"))
      .map((element) => getComputedStyle(element).viewTransitionName)
      .filter((name) => name.startsWith("project-"))
      .sort();

    // Observe the browser's real snapshots and promises without changing its callback or timing.
    document.startViewTransition = (callbackOptions) => {
      const observation: TransitionObservation = {
        oldNames: names(), newNames: [], animationTargets: [], durations: [],
        ready: false, finished: false, error: null,
      };
      window.__projectTransitions.push(observation);
      const transition = native(callbackOptions);
      void transition.ready.then(() => {
        observation.ready = true;
        observation.newNames = names();
        const effects = document.getAnimations()
          .map((animation) => animation.effect)
          .filter((effect): effect is KeyframeEffect => effect instanceof KeyframeEffect && Boolean(effect.pseudoElement?.startsWith("::view-transition")));
        observation.animationTargets = effects.map((effect) => effect.pseudoElement!);
        observation.durations = effects.map((effect) => Number(effect.getTiming().duration));
      }).catch((error: unknown) => { observation.error = String(error); });
      void transition.finished.then(() => { observation.finished = true; })
        .catch((error: unknown) => { observation.error = String(error); });
      return transition;
    };
  }, { unavailable });
}

async function completedTransition(page: Page, index: number) {
  await expect.poll(() => page.evaluate((index) => window.__projectTransitions[index]?.finished, index)).toBe(true);
  const observation = await page.evaluate((index) => window.__projectTransitions[index], index);
  expect(observation.error).toBeNull();
  expect(observation.ready).toBe(true);
  return observation;
}

async function listingOrigin(page: Page, project = "Send", viaHero = false) {
  await page.goto(viaHero ? "/?view=highlights" : "/?view=highlights#work");
  await expect(page.getByRole("button", { name: /Switch to (dark|light) theme/ })).toBeVisible();
  if (viaHero) {
    await page.getByRole("link", { name: "See highlights" }).click();
    await expect(page).toHaveURL(/\?view=highlights#work$/);
  }
  const article = page.getByRole("article").filter({ has: page.getByRole("heading", { level: 3, name: project, exact: true }) });
  const details = article.getByRole("link", { name: "Project details" });
  await details.scrollIntoViewIfNeeded();
  await expect(details).toBeInViewport({ ratio: 1 });
  await expect.poll(() => details.evaluate((element) => {
    for (let node: Element | null = element; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (Number(style.opacity) < 0.99 || Math.abs(new DOMMatrixReadOnly(style.transform).m42) >= 0.5) return false;
    }
    return true;
  })).toBe(true);
  const origin = await page.evaluate(() => ({ url: location.href, scroll: scrollY, key: history.state?.key ?? "default" }));
  return { article, details, origin };
}

async function expectOriginalListing(page: Page, origin: { url: string; scroll: number; key: string }) {
  await expect(page).toHaveURL(origin.url);
  await expect.poll(() => page.evaluate(() => history.state?.key ?? "default")).toBe(origin.key);
  await expect.poll(async () => Math.abs(await page.evaluate(() => scrollY) - origin.scroll)).toBeLessThanOrEqual(1);
}

test("the selected screenshot and rule share real native snapshots, then All work restores its exact entry", async ({ page, isMobile }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await observeNativeTransitions(page);
  const { article, details, origin } = await listingOrigin(page, "Send", true);
  if (!isMobile) await expect(article.getByRole("img")).toBeInViewport();
  await details.click();
  await expect(page).toHaveURL(/\/work\/send$/);
  await expect(page.getByRole("heading", { level: 1, name: "Send", exact: true })).toBeInViewport();
  const forward = await completedTransition(page, 0);
  const sharedNames = ["project-send-frame", "project-send-image"];
  expect(forward.oldNames).toEqual(sharedNames);
  expect(forward.newNames).toEqual(sharedNames);
  // On a narrow screen the source image can be above the activated details link.
  // Keep navigation truthful instead of scrolling it back into view for the animation.
  if (!isMobile) {
    expect(forward.animationTargets).toEqual(expect.arrayContaining([
      "::view-transition-group(project-send-image)",
      "::view-transition-group(project-send-frame)",
    ]));
    expect(forward.durations.every((duration) => duration > 0 && duration <= 500)).toBe(true);
  }
  expect(forward.animationTargets).not.toContain("::view-transition-group(root)");
  await page.getByRole("link", { name: "All work" }).click();
  await expectOriginalListing(page, origin);
  const reverse = await completedTransition(page, 1);
  expect(reverse.oldNames).toEqual(sharedNames);
  expect(reverse.newNames).toEqual(sharedNames);
});

test("browser Back and Forward preserve the selected project and its original listing position", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await observeNativeTransitions(page);
  const { details, origin } = await listingOrigin(page, "BrightID Bot");
  await details.click();
  await expect(page).toHaveURL(/\/work\/brightid$/);
  await completedTransition(page, 0);
  await page.goBack();
  await expectOriginalListing(page, origin);
  await completedTransition(page, 1);
  await page.goForward();
  await expect(page).toHaveURL(/\/work\/brightid$/);
  await completedTransition(page, 2);
  await expect(page.getByRole("heading", { level: 1, name: "BrightID Bot", exact: true })).toBeInViewport();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});

test("a directly opened case study returns to the work section", async ({ page }) => {
  await page.goto("/work/shenanigan");
  await page.getByRole("link", { name: "All work" }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.getByRole("heading", { name: "My recent highlights" })).toBeInViewport();
});

test("enabling reduced motion stops shared animation on return and subsequent navigation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await observeNativeTransitions(page);
  const { details, origin } = await listingOrigin(page);
  await details.click();
  await completedTransition(page, 0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("link", { name: "All work" }).click();
  await expectOriginalListing(page, origin);
  // Router remembers native transition pairs for POP; CSS and live motion settings
  // must suppress their animation even when the API is still called on browser history.
  const reverse = await completedTransition(page, 1);
  expect(reverse.oldNames).toEqual([]);
  expect(reverse.newNames).toEqual([]);
  expect(reverse.animationTargets).toEqual([]);
  await page.getByRole("link", { name: "Project details" }).first().click();
  await expect(page).toHaveURL(/\/work\/send$/);
  expect(await page.evaluate(() => window.__projectTransitions.length)).toBe(2);
  await expect(page.getByRole("main")).toHaveCSS("transform", "none");
  await expect(page.getByRole("heading", { level: 1, name: "Send", exact: true })).toBeInViewport();
});

test("without the native API, project navigation and exact scroll return still work", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await observeNativeTransitions(page, true);
  const { details, origin } = await listingOrigin(page);
  await details.click();
  await expect(page).toHaveURL(/\/work\/send$/);
  await expect(page.getByRole("heading", { level: 1, name: "Send", exact: true })).toBeInViewport();
  await expect(page.getByRole("main")).toHaveCSS("transform", "none");
  await page.getByRole("link", { name: "All work" }).click();
  await expectOriginalListing(page, origin);
  expect(await page.evaluate(() => window.__projectTransitions)).toEqual([]);
  expect(errors).toEqual([]);
});
