import { serialize } from "cookie";

import { auth } from "~/server/auth";
import type { Env } from "~/server/env";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const headers = new Headers();

  // Handles request
  const authRequest = auth(env).handleRequest(request, headers);

  // Fetches session and user object from the database
  const session = await authRequest.validate();

  // Invalides Session
  auth(env)
    .invalidateSession(session?.sessionId ?? "")
    .catch(() => {
      return;
    });

  // Removes Auth Session Cookie
  headers.append(
    "Set-Cookie",
    serialize("auth_session", "", {
      path: "/",
      maxAge: -1,
    }),
  );

  return new Response(null, {
    headers,
  });
};
