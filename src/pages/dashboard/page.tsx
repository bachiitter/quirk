import { Route } from "@tanstack/router";
import { Helmet } from "react-helmet-async";

import { useAuth } from "~/context/auth";

import { DashboardRoute } from "./layout";

export const DashboardIndexRoute = new Route({
  getParentRoute: () => DashboardRoute,
  path: "/",
  component: () => {
    const { session } = useAuth();

    return (
      <>
        <Helmet title="Dashboard" />
        <pre className="overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm text-muted-foreground ">
          <code>{JSON.stringify(session, null, 2)}</code>
        </pre>
      </>
    );
  },
});
