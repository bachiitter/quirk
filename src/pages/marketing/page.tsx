import { Route } from "@tanstack/router";

import { useAuth, useSignOut } from "~/context/auth";

import { MarketingRoute } from "./layout";

export const IndexRoute = new Route({
  getParentRoute: () => MarketingRoute,
  path: "/",
  component: Home,
});

function Home() {
  const { session, refreshSession } = useAuth();

  const signOut = useSignOut();

  if (session) {
    return (
      <div className="flex flex-col gap-2">
        <p>Hello {session.user.name}</p>
        <div className="flex gap-2">
          <button onClick={() => refreshSession()}>
            <span>Refresh</span>
          </button>
          <button onClick={() => signOut()}> SignOut</button>
        </div>
      </div>
    );
  }

  return <div>Hello World</div>;
}
