import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { Router, RouterProvider } from "@tanstack/router";
import { HelmetProvider } from "react-helmet-async";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";

import { appRoute } from "~/pages/_app";

import "~/styles/index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";

import { AuthProvider } from "./context/auth";
import { ThemeProvider } from "./context/theme";
import { trpc } from "./lib/utils";
import { DashboardRoute } from "./pages/dashboard/layout";
import { DashboardIndexRoute } from "./pages/dashboard/page";
import { SettingsRoute } from "./pages/dashboard/settings/page";
import { IndexRoute, MarketingRoute } from "./pages/marketing";

const routeTree = appRoute.addChildren([
  MarketingRoute.addChildren([IndexRoute]),
  DashboardRoute.addChildren([DashboardIndexRoute, SettingsRoute]),
]);

const router = new Router({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc",
        }),
      ],
    }),
  );

  return (
    <ThemeProvider>
      <AuthProvider>
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <HelmetProvider>
              <RouterProvider router={router} />
            </HelmetProvider>
          </QueryClientProvider>
        </trpc.Provider>
      </AuthProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
