import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { meta as homeMeta } from "~/routes/home";
import { meta as resumeMeta } from "~/routes/resume";
import { meta as brightIdMeta } from "~/routes/work.brightid";
import { meta as openSourceMeta } from "~/routes/work.open-source";
import { meta as sendMeta } from "~/routes/work.send";
import { meta as shenaniganMeta } from "~/routes/work.shenanigan";
import { site } from "~/data/site";

describe("social preview", () => {
  it("uses the public production origin", () => {
    expect(site.url).toBe("https://victor.she.energy");
  });

  it.each([
    ["home", homeMeta, "https://victor.she.energy/", "https://victor.she.energy/og.png"],
    ["resume", resumeMeta, "https://victor.she.energy/resume", "https://victor.she.energy/og.png"],
    ["Send", sendMeta, "https://victor.she.energy/work/send", "https://victor.she.energy/images/work/send.jpg"],
    ["Shenanigan", shenaniganMeta, "https://victor.she.energy/work/shenanigan", "https://victor.she.energy/images/work/pants.jpg"],
    ["BrightID", brightIdMeta, "https://victor.she.energy/work/brightid", "https://victor.she.energy/images/work/brightid-bot.jpg"],
    ["open source", openSourceMeta, "https://victor.she.energy/work/open-source", "https://victor.she.energy/images/work/open-source.jpg"],
  ])("ships complete metadata for %s", (_name, meta, canonicalUrl, imageUrl) => {
    const descriptors = meta({} as never);

    expect(descriptors).toEqual(expect.arrayContaining([
      { tagName: "link", rel: "canonical", href: canonicalUrl },
      { property: "og:url", content: canonicalUrl },
      { property: "og:image", content: imageUrl },
      { property: "og:image:secure_url", content: imageUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: imageUrl },
    ]));
  });

  it("ships a 1200 by 630 PNG", () => {
    const image = readFileSync("public/og.png");

    expect(image.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(image.readUInt32BE(16)).toBe(1200);
    expect(image.readUInt32BE(20)).toBe(630);
  });
});
