import React from "react";
import ReactDOM from "react-dom/client";
import { Router, RouterProvider } from "@tanstack/router";
import { HelmetProvider } from "react-helmet-async";

import "@fontsource/inter";

import { appRoute } from "~/pages/_app";
import { IndexRoute } from "~/pages/index";

import "~/styles/index.css";

const routeTree = appRoute.addChildren([IndexRoute]);

const router = new Router({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>,
);
