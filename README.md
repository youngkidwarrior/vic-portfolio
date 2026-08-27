# Victor Ginelli portfolio

A prerendered React portfolio for Victor Ginelli, focused on founding product engineering across payments, identity, mobile, infrastructure, and onchain systems.

## Local development

Requirements: Bun 1.3.11+ and Node 20.20+.

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

Case-study narratives live in `app/content/*.mdx`. Shared metrics, links, artwork paths, and site metadata live in `app/data/site.ts`.

The build prerenders:

- `/`
- `/work/send`
- `/work/shenanigan`
- `/work/brightid`
- `/work/open-source`
- `/resume`

## Private source material

Raw research, the source resume, visual references, and worker prompts use the repository’s `*.ignore.*` convention and must not be committed. Production artwork in `public/images` is original generated work derived from general visual principles, not copied reference compositions.

The HTML intentionally omits Victor’s phone number. It remains available only in the downloadable PDF resume.

## Cloudflare Pages

The GitHub Actions workflow builds and deploys `build/client` to the `vic-portfolio` Pages project on pushes to `main`. Configure these repository secrets before deployment:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_WEB_ANALYTICS_TOKEN`

Set the production custom domain in Cloudflare after the Pages project exists. The analytics script is omitted when its token is unavailable.

## Remaining owner input

Configure the Cloudflare project credentials and analytics token before the first deployment.
