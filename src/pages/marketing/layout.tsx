import { Outlet, Route } from "@tanstack/router";

import { appRoute } from "../_app";

export const MarketingRoute = new Route({
  getParentRoute: () => appRoute,
  id: "marketing-layout",
  component: () => {
    return (
      <>
        <header></header>
        <main className="mt-6 px-6">
          <Outlet />
        </main>
      </>
    );
  },
});
