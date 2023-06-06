import { serialize } from "cookie";

import { auth } from "~/server/auth";
import type { Env } from "~/server/env";

export const onRequestPost: PagesFunction<Env> = ({ request, env }) => {
  const headers = new Headers();

  // Performs CSRF check and gets session id from request
  const sessionId = auth(env).parseRequestHeaders({
    headers: {
      cookie: request.headers.get("Cookie"),
      origin: request.headers.get("Origin"),
    },
    method: request.method,
    url: request.url,
  });

  // Invalides Session
  auth(env)
    .invalidateSession(sessionId ?? "")
    .catch((e) => {
      console.error(e);
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
