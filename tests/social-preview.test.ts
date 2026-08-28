import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { meta } from "~/root";
import { site } from "~/data/site";

describe("social preview", () => {
  it("uses the branded portfolio card for Open Graph and X", () => {
    const descriptors = meta({} as never);
    const socialPreviewImage = `${site.url}${site.socialImage}`;

    expect(descriptors).toEqual(expect.arrayContaining([
      { property: "og:image", content: socialPreviewImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: socialPreviewImage },
    ]));
  });

  it("ships a 1200 by 630 PNG", () => {
    const image = readFileSync("public/og.png");

    expect(image.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(image.readUInt32BE(16)).toBe(1200);
    expect(image.readUInt32BE(20)).toBe(630);
  });
});
