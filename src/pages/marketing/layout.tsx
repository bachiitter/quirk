import { Link, Outlet, Route } from "@tanstack/router";

import { ThemeToggle } from "~/components/theme-toggle";
import { Button, buttonVariants } from "~/components/ui/button";
import { signIn, useAuth } from "~/context/auth";

import { appRoute } from "../_app";

export const MarketingRoute = new Route({
  getParentRoute: () => appRoute,
  id: "marketing-layout",
  component: () => {
    const { session } = useAuth();

    return (
      <>
        <header className="container flex items-center justify-between py-6">
          <Link to="/">
            <span className="text-xl font-bold">Quirk</span>
          </Link>
          <div className="flex items-center gap-2">
            {session ? (
              <Link
                className={buttonVariants({ variant: "default" })}
                to="/dashboard">
                Dashboard
              </Link>
            ) : (
              <Button onClick={() => signIn("github")}>Sign In</Button>
            )}
            <ThemeToggle />
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </>
    );
  },
});
