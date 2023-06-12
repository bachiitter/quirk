import type { RegisteredRoutesInfo } from "@tanstack/router";
import { Link, Navigate, Outlet, Route } from "@tanstack/router";

import { SidebarNav } from "~/components/sidebar-nav";
import { ThemeToggle } from "~/components/theme-toggle";
import { UserDialog } from "~/components/user-dialog";
import { useAuth } from "~/context/auth";

import { appRoute } from "../_app";

const sidebarNavItems: {
  href: RegisteredRoutesInfo["routePaths"];
  title: string;
}[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
  },
];

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
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
              <aside className="lg:w-1/5">
                <SidebarNav items={sidebarNavItems} />
              </aside>
              <div className="flex-1 p-10 pb-16 lg:max-w-2xl">
                <Outlet />
              </div>
            </div>
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
