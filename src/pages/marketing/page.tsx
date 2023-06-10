import { Route } from "@tanstack/router";

import { MarketingRoute } from "./layout";

export const IndexRoute = new Route({
  getParentRoute: () => MarketingRoute,
  path: "/",
  component: Home,
});

function Home() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2">
        <h1 className="text-center text-4xl font-extrabold leading-tight tracking-tighter sm:text-5xl">
          Build blazing fast web apps on the edge.
        </h1>
        <p className="max-w-[700px] text-center text-lg text-muted-foreground">
          An opinionated open-source template for building full-stack web apps
          using React and Cloudflare Pages/Functions.
        </p>
        <div></div>
      </div>
    </section>
  );
}
