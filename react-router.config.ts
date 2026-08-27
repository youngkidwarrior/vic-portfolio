import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  prerender: [
    "/",
    "/work/send",
    "/work/shenanigan",
    "/work/brightid",
    "/work/open-source",
    "/resume",
  ],
} satisfies Config;
