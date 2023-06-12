import type { RegisteredRoutesInfo } from "@tanstack/router";
import { Link, useRouter } from "@tanstack/router";

import { cn } from "~/lib/utils";

import { buttonVariants } from "./ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: RegisteredRoutesInfo["routePaths"];
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const router = useRouter();

  const pathname = router.state.currentLocation.pathname;

  return (
    <>
      <nav
        className={cn(
          "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
          className,
        )}
        {...props}>
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start",
            )}>
            {item.title}
          </Link>
        ))}
      </nav>
    </>
  );
}
