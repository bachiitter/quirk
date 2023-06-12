import { Link, Navigate, Outlet, Route } from "@tanstack/router";

import { ThemeToggle } from "~/components/theme-toggle";
import { UserDialog } from "~/components/user-dialog";
import { useAuth } from "~/context/auth";

import { appRoute } from "../_app";

export const DashboardRoute = new Route({
  getParentRoute: () => appRoute,
  path: "/dashboard",
  component: () => {
    const { session, isLoading } = useAuth();

    if (session) {
      return (
        <>
          <header className="container flex items-center justify-between py-6">
            <Link to="/">
              <span className="text-xl font-bold">Quirk</span>
            </Link>
            <div className="flex items-center gap-2">
              <UserDialog
                name={session.user.name!}
                email={session.user.email!}
                imageSrc={session.user.image!}
              />

              <ThemeToggle />
            </div>
          </header>
          <main className="container">
            <Outlet />
          </main>
        </>
      );
    }

    if (isLoading) {
      return (
        <>
          <header className="container flex items-center justify-between py-6">
            <Link to="/">
              <span className="text-xl font-bold">Quirk</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>
          <main className="container">Loading...</main>
        </>
      );
    }

    return <Navigate from="/dashboard" to="/" />;
  },
});
