# Image delivery impact

## Scope and baseline

The baseline is `0972c53` on `main`. It contains 2,675,323 bytes of public images, including social previews, and 2,680,666 bytes of all public files. The portfolio's page images account for 1,637,602 unique bytes; the 1,037,537-byte Open Graph PNG is not fetched as page content.

A fresh desktop visit to the motion PR's Netlify preview, with the HTTP cache disabled, transferred 1,909,084 bytes of same-origin resource bodies, including 1,701,626 bytes of image responses. This excludes HTML, response headers, and Netlify's third-party preview tooling. The portrait was requested twice; unique image URLs accounted for 1,637,602 bytes. All page images had already loaded at the initial measurement; scrolling did not add requests in this Chromium viewport. These figures describe a measured visit, not a universal loading budget.

## Changes

| Asset | Original bytes | Optimized bytes | Saving |
| --- | ---: | ---: | ---: |
| Send screenshot | 130,035 | 84,760 | 45,275 |
| Open-source screenshot | 131,788 | 75,108 | 56,680 |
| BrightID screenshot | 61,756 | 43,670 | 18,086 |
| PANTS screenshot | 46,151 | 26,056 | 20,095 |
| **Page screenshots** | **369,730** | **229,594** | **140,136 (37.9%)** |
| Social PNG | 1,037,537 | 887,299 | 150,238 (14.5%) |

Pages use WebP screenshots at the original dimensions, encoded with Pillow/libwebp at quality 95 and method 6. Side-by-side review found no visible loss in screenshot text, faces, or product detail. This encoding is lossy, not pixel-identical; RGB PSNR against the decoded JPEG originals ranges from 46.41 to 50.24 dB. The PNG recompression is pixel-identical and preserves its gamma and chromaticity metadata.

The JPEG originals remain available at their existing social-preview URLs. The social metadata remains JPEG/PNG; only page rendering switches to WebP. Dimensions, alt text, loading policy, and shared-transition names are unchanged.

Existing artwork and portrait WebPs remain unchanged. Quality-95 artwork re-encoding made every tested poster larger; quality 90 produced negligible savings or larger files, with additional lossy encoding. Those candidates were rejected.

## Transfer versus storage

- Unique page-image payload falls from **1,637,602 to 1,497,466 bytes**, an **8.6% reduction**.
- A visitor loading all four screenshots saves **140,136 bytes**, excluding headers. The social PNG saving benefits crawlers and direct image requests, not normal page visits.
- Total deployed image storage rises from **2,675,323 to 2,754,679 bytes** (**79,356 bytes, 3.0%**) because the JPEG social images are retained alongside the new WebPs. This PR reduces browser transfer, not total deployment storage.
- These byte reductions do not establish an equivalent percentage improvement in load time or animation FPS. The motion optimization is an independent sibling PR.

## Reproduction

`bun run build && bun run report:assets` reports emitted JavaScript, CSS, fonts, and image inventory. A measured visit uses:

```sh
TARGET_URL=https://deploy-preview-15--vic-portfolio-web.netlify.app \
REPORT_PATH=/tmp/portfolio-image-transfer-before.json \
node scripts/profile-images.mjs
```

The same command accepts the image PR preview URL for the comparison. The script uses a fresh browser context at 1440 × 1000 with cache disabled, records same-origin encoded resource bodies before and after scrolling, and separates repeated image requests from unique URLs.

The WebPs can be reproduced from the retained JPEGs using `Image.open(source).save(destination, "WEBP", quality=95, method=6)` with Pillow. The comparison used Pillow's decoded RGB pixels; the original JPEGs remain the authoritative screenshot sources. Browser checks verify decoded WebP delivery on the home page and every case study while preserving JPEG social metadata.
