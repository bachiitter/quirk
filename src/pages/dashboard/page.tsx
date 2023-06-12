import { Route } from "@tanstack/router";
import { Helmet } from "react-helmet-async";

import { trpc } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";
import { useAuth } from "~/context/auth";

import { DashboardRoute } from "./layout";

export const DashboardIndexRoute = new Route({
  getParentRoute: () => DashboardRoute,
  path: "/",
  component: () => {
    const { session } = useAuth();

    const secretMessageQuery = trpc.secretMessage.useQuery();

    return (
      <>
        <Helmet title="Dashboard" />
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Separator className="my-6" />
        <pre className="overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm text-muted-foreground ">
          <code>{JSON.stringify(session, null, 2)}</code>
        </pre>
        <Separator className="my-6" />
        <h3 className="text-lg font-bold tracking-tight">
          tPRC Secret Message
        </h3>
        <p className="text-muted-foreground">{secretMessageQuery.data}</p>
      </>
    );
  },
});
