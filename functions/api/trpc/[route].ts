import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "~/server/api/_app";
import { createContext } from "~/server/api/trpc";
import type { Env } from "~/server/env";

const handler = async ({ request, env }: { request: Request; env: Env }) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: request,
    router: appRouter,
    createContext: createContext({ env, req: request }),
  });
};

export const onRequest: PagesFunction<Env> = ({ request, env }) =>
  handler({ request, env });
