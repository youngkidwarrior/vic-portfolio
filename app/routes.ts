import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("work/send", "routes/work.send.tsx"),
  route("work/shenanigan", "routes/work.shenanigan.tsx"),
  route("work/brightid", "routes/work.brightid.tsx"),
  route("work/open-source", "routes/work.open-source.tsx"),
  route("resume", "routes/resume.tsx"),
] satisfies RouteConfig;
