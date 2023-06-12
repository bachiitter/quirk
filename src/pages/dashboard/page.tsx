import { Route } from "@tanstack/router";

import { useAuth } from "~/context/auth";

import { DashboardRoute } from "./layout";

export const DashboardIndexRoute = new Route({
  getParentRoute: () => DashboardRoute,
  path: "/",
  component: () => {
    const { session } = useAuth();

    return (
      <>
        <pre>{JSON.stringify(session, null, 2)}</pre>
      </>
    );
  },
});
