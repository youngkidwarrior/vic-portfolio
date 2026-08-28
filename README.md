# Victor Ginelli portfolio

A prerendered React portfolio for Victor Ginelli, focused on founding and full-stack product engineering across payments, identity, mobile, infrastructure, and onchain systems.

## Local development

Requirements: Bun 1.3.11+, Node 20.20+, and Python 3.

```sh
bun install
bun run dev
```

## Verification

```sh
bun run check
bunx playwright install chromium
bun run test:e2e
```

`bun run check` runs type generation, TypeScript, unit tests, the production build, and prerendering. The browser suite serves `build/client`, so run the build first when testing changes directly.

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
