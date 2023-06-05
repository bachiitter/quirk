import { Outlet, RootRoute } from "@tanstack/router";
import { Helmet } from "react-helmet-async";

import { siteConfig } from "~/lib/constants";

export const appRoute = new RootRoute({
  component: () => {
    return (
      <>
        <Helmet
          titleTemplate={`%s | ${siteConfig.name}`}
          defaultTitle={siteConfig.name}>
          {/* Primary Meta Tags */}
          <meta name="description" content={siteConfig.description} />
          <meta name="authhor" content="bachiitter" />
          <link rel="author" href="https://bachitter.dev" />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Shoubhit Dash" />
          <meta property="og:url" content={siteConfig.url} />
          <meta property="og:title" content={siteConfig.name} />
          <meta property="og:description" content={siteConfig.name} />
          <meta property="og:image" content={siteConfig.ogImage} />

          {/* Twitter */}
          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content={siteConfig.url} />
          <meta property="twitter:title" content={siteConfig.name} />
          <meta
            property="twitter:description"
            content={siteConfig.description}
          />
          <meta property="twitter:image" content={siteConfig.ogImage} />
        </Helmet>
        <Outlet />
      </>
    );
  },
});
