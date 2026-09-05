# Victor Ginelli portfolio

A prerendered React portfolio for Victor Ginelli, focused on founding and full-stack product engineering across payments, identity, mobile, infrastructure, and onchain systems.

## Local development

Requirements: Bun 1.3.11+, Node 20.20+, and Python 3.

```sh
bun install
bun run dev
```

To preview the production output, run `bun run build` followed by `bun run start` (port 8000). Pass a free port for another worktree, for example `bun run start 8001`. The build is static; it does not emit a runtime server bundle.

## Verification

```sh
bunx playwright install chromium
bun run check:all
```

`bun run check:all` runs type generation, TypeScript, unit tests, the production build, prerendering, and desktop/mobile browser checks. `bun run check` omits browser checks.

`bun run test:e2e` always builds fresh output before testing. Use `bun run test:e2e:built` only when `build/client` was already built from the current source (as in CI). The browser suite owns its local server and refuses to reuse an occupied port. Separate worktrees can select different ports:

```sh
PLAYWRIGHT_PORT=4174 bun run test:e2e
bun run test:e2e:built --grep "primary journey"
DEBUG=pw:webserver bun run test:e2e:built --grep "primary journey"
bunx playwright show-trace test-results/<failed-test>/trace.zip
```

Failures retain traces and screenshots in `test-results/`; CI uploads that directory as `browser-failures`. Browser checks cover all routes, light/dark accessibility, navigation, mobile overflow, images, metadata, PDF availability, and content with JavaScript disabled. CSS source-string assertions are intentionally avoided; browser checks validate rendered behavior.

### Motion review

Motion is part of the portfolio's design brief: kinetic throughout, with pointer response on desktop and scroll/tap equivalents on touch devices. `MotionSystem` shares the live reduced-motion and pointer preferences; the portrait, project framing, entrances, and controls use Motion's `domAnimation` features. Prerendered content stays readable before JavaScript loads.

The generated prints in `public/images/art` frame the real portrait and project screenshots. The hero moves one media plane; `ProjectArt` uses cropped planes for Send's horizontal flow, Shenanigan's stepped entrance, BrightID's alignment, and open-source branching. These media elements are the replacement points for future animated artwork. Keep their dimensions, decorative semantics, static fallback, and reduced-motion behavior when changing the media format.

Each project currently draws three slices from one cached static image. Animated replacements need explicit media integration: retain a static source for reduced motion and use shared playback instead of three independently playing videos.

Project details use Router-managed native view transitions for the selected screenshot and rule. Returning through All work restores the original history entry and scroll position; directly opened case studies return to the work section. Internal links must retain Router history so that this return path also works after a hero or header anchor.

```sh
bun run test:motion
```

This builds current source and saves desktop/mobile videos plus light, dark, pointer, selected-work, case-study, and individual project screenshots in `test-results/`. The suite checks artwork delivery, pointer return, touch scrolling, changed reduced-motion preferences, slow hydration, and navigation. `project-transitions.spec.ts` additionally observes real native snapshots and checks exact history/scroll restoration, Back/Forward, direct entry, and browsers without the native API. Review the recordings for pacing and visual taste; passing assertions alone cannot establish either.

For bundle comparisons, run `bun run build` then `bun run report:assets` on each revision. The report measures all emitted client JavaScript, CSS, and fonts, with raw and gzip byte totals. These are artifact sizes, not measured page-load times or per-route transfer totals.

## Content and routes

Project narratives, links, screenshots, and site metadata live in `app/data/site.ts`. The web and PDF resumes share `content/resume.json`; after editing it, regenerate the downloadable PDF with:

```sh
bun run setup:resume
bun run build:resume
```

The build prerenders:

- `/`
- `/work/send`
- `/work/shenanigan`
- `/work/brightid`
- `/work/open-source`
- `/resume`

## Private source material

Raw research, local migration notes, the source resume, visual references, and worker prompts use the repository’s `*.ignore.*` or `*.local.*` conventions and must not be committed. The files in `public/images/work` are authentic cropped project screenshots, and `public/images/victor-portrait.webp` is Victor's portrait. Generated decorative and social artwork, such as `public/og.png`, is original work derived from general visual principles rather than copied reference compositions.

Victor’s phone number is intentionally omitted from every public surface, including the downloadable PDF resume.

## Cloudflare Pages

The GitHub Actions workflow builds and deploys `build/client` to the `vic-portfolio` Pages project on pushes to `main`. Configure these repository secrets before deployment:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

`CLOUDFLARE_WEB_ANALYTICS_TOKEN` is optional. When it is set, the build passes it to the manually embedded Cloudflare Web Analytics beacon; when it is absent, the beacon is omitted.

Set the production custom domain in Cloudflare after the Pages project exists.
