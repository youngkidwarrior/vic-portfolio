import type { LinksFunction, MetaFunction } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";
import { site } from "~/data/site";
import "~/styles/app.css";
import "@fontsource-variable/space-grotesk";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";

const socialPreviewImage = `${site.url}${site.socialImage}`;

export const meta: MetaFunction = () => [
  { title: `${site.name} | ${site.role}` },
  { name: "description", content: site.description },
  { property: "og:title", content: `${site.name} | ${site.role}` },
  { property: "og:description", content: site.description },
  { property: "og:type", content: "website" },
  { property: "og:url", content: site.url },
  { property: "og:image", content: socialPreviewImage },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  { property: "og:image:alt", content: "Victor Ginelli's Portfolio" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:image", content: socialPreviewImage },
  { name: "twitter:image:alt", content: "Victor Ginelli's Portfolio" },
];

export const links: LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const analyticsToken = import.meta.env.VITE_CF_WEB_ANALYTICS_TOKEN;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme:dark)').matches;document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {analyticsToken ? (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: analyticsToken })}
          />
        ) : null}
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main id="main-content">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : "This page could not be loaded.";
  return (
    <main className="error-page">
      <p className="mono-label">404 / Off course</p>
      <h1>The route moved. The work did not.</h1>
      <p>{message}</p>
      <a className="text-link" href="/">Return home</a>
    </main>
  );
}
