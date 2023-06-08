import React from "react";
import ReactDOM from "react-dom/client";
import { Router, RouterProvider } from "@tanstack/router";
import { HelmetProvider } from "react-helmet-async";

import "@fontsource/inter";

import { appRoute } from "~/pages/_app";

import "~/styles/index.css";

import { AuthProvider } from "./context/auth";
import { IndexRoute, MarketingRoute } from "./pages/marketing";

const routeTree = appRoute.addChildren([
  MarketingRoute.addChildren([IndexRoute]),
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
  return (
    <AuthProvider>
      <HelmetProvider>
        <RouterProvider router={router} />
      </HelmetProvider>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
