import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "~/server/api/_app";
import { createContext } from "~/server/api/trpc";
import type { Env } from "~/server/env";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: createContext({ env, req: request }),
  });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: createContext({ env, req: request }),
  });
};
