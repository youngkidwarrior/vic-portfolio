import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

// Run one headed profile at a time, without other browser tests competing for CPU.
// Frame callbacks measure main-thread scheduling; the trace also records actual
// compositor presentations, which can drop even when callbacks look smooth.
const browser = await chromium.launch({ headless: false });
try {
  const context = await browser.newContext({ viewport: process.env.MOBILE ? { width: 393, height: 851 } : { width: 1440, height: 1000 }, deviceScaleFactor: process.env.MOBILE ? 2.75 : 2, isMobile: Boolean(process.env.MOBILE), hasTouch: Boolean(process.env.MOBILE), reducedMotion: 'no-preference', colorScheme: 'light' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.clearBrowserCache');
  if (process.env.CPU) await cdp.send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.CPU) });
  await page.addInitScript(() => {
    window.frameSamples = [];
    window.longTasks = [];
    new PerformanceObserver(list => window.longTasks.push(...list.getEntries().map(e => ({ start: e.startTime, duration: e.duration })))).observe({ type: 'longtask', buffered: true });
    let previous;
    function sample(now) {
      if (previous) window.frameSamples.push({ time: now, duration: now - previous });
      previous = now;
      requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
  const events = [];
  cdp.on('Tracing.dataCollected', ({ value }) => events.push(...value));
  await cdp.send('Tracing.start', { categories: 'devtools.timeline,blink,cc', transferMode: 'ReportEvents' });
  await page.goto(process.env.TARGET_URL || 'http://127.0.0.1:5173/');
  await page.waitForFunction(() => performance.now() > 6500);
  const phases = [];
  if (process.env.JOURNEY) {
    for (const slug of ['hero', 'send', 'shenanigan', 'brightid', 'open-source']) {
      const start = await page.evaluate(() => performance.now());
      await page.locator(`[data-artwork="${slug}"]`).scrollIntoViewIfNeeded();
      await page.evaluate(async () => {
        const start = performance.now();
        await new Promise(resolve => {
          const tick = () => performance.now() - start >= 3800 ? resolve() : requestAnimationFrame(tick);
          requestAnimationFrame(tick);
        });
      });
      phases.push([slug, start, await page.evaluate(() => performance.now())]);
    }
  }
  const result = await page.evaluate(() => ({ frames: window.frameSamples, longTasks: window.longTasks, resources: performance.getEntriesByType('resource').filter(e => e.initiatorType !== 'fetch').map(e => ({ name: e.name, transferSize: e.transferSize })) }));
  const complete = new Promise(resolve => cdp.once('Tracing.tracingComplete', resolve));
  await cdp.send('Tracing.end');
  await complete;
  if (errors.length) throw new Error(`Cannot profile a page with runtime errors: ${errors.join('; ')}`);
  // A static prerender can look smooth even when hydration failed.
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await page.screenshot({ path: `/tmp/portfolio-${process.env.LABEL || 'motion'}.png` });
  const summary = {};
  for (const [name, start, end] of [['load', 0, 6500], ['initialWindow', 1000, 4000], ['settledWindow', 4500, 6500], ...phases]) {
    const frames = result.frames.filter(f => f.time >= start && f.time < end).map(f => f.duration).sort((a, b) => a - b);
    summary[name] = { count: frames.length, fps: 1000 / (frames.reduce((a, b) => a + b, 0) / frames.length), p95: frames[Math.floor(frames.length * .95)], max: frames.at(-1), over25ms: frames.filter(v => v > 25).length };
  }
  summary.longTasks = result.longTasks;
  const renderer = events.find(event => event.name === 'FrameStartedLoading')?.pid;
  if (renderer === undefined) throw new Error('The trace is missing the page renderer; presentation counts cannot be verified.');
  summary.presentations = {};
  for (const event of events) {
    if (event.name !== 'PipelineReporter' || event.ph !== 'b' || event.pid !== renderer) continue;
    const frame = event.args.frame_reporter;
    if (!frame.has_main_animation && !frame.has_compositor_animation && !frame.affects_smoothness) continue;
    summary.presentations[frame.state] = (summary.presentations[frame.state] || 0) + 1;
  }
  summary.trace = Object.fromEntries(['Paint', 'Layout', 'UpdateLayoutTree', 'RasterTask'].map(name => {
    const matches = events.filter(e => e.name === name && e.dur);
    return [name, { count: matches.length, totalMs: matches.reduce((n, e) => n + e.dur / 1000, 0) }];
  }));
  const environment = {
    recordedAt: new Date().toISOString(),
    browser: browser.version(),
    url: page.url(),
    viewport: page.viewportSize(),
    mobile: Boolean(process.env.MOBILE),
    cpuSlowdown: Number(process.env.CPU || 1),
    journey: Boolean(process.env.JOURNEY),
    cacheDisabled: true,
  };
  await writeFile(`/tmp/portfolio-${process.env.LABEL || 'motion'}.json`, JSON.stringify({ environment, summary, result, traceEvents: events }));
  console.log(JSON.stringify(summary, null, 2));
} finally { await browser.close(); }
