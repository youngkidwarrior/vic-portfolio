import type { MetaDescriptor } from "react-router";
import { site } from "~/data/site";

type SocialImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  type: "image/jpeg" | "image/png";
};

type SeoMetaOptions = {
  title: string;
  description: string;
  pathname: string;
  image?: SocialImage;
};

const defaultSocialImage: SocialImage = {
  src: site.socialImage,
  width: 1200,
  height: 630,
  alt: "Victor Ginelli's Portfolio",
  type: "image/png",
};

function absoluteUrl(pathname: string) {
  return new URL(pathname, `${site.url}/`).toString();
}

export function createSeoMeta({
  title,
  description,
  pathname,
  image = defaultSocialImage,
}: SeoMetaOptions): MetaDescriptor[] {
  const canonicalUrl = absoluteUrl(pathname);
  const imageUrl = absoluteUrl(image.src);

  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { property: "og:site_name", content: site.name },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:image", content: imageUrl },
    { property: "og:image:secure_url", content: imageUrl },
    { property: "og:image:type", content: image.type },
    { property: "og:image:width", content: String(image.width) },
    { property: "og:image:height", content: String(image.height) },
    { property: "og:image:alt", content: image.alt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
    { name: "twitter:image:alt", content: image.alt },
  ];
}
