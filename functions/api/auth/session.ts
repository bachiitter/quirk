import { auth } from "~/server/auth";
import type { Env } from "~/server/env";
import { jsonResp } from "~/server/utils";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  // Performs CSRF check and gets session id from request
  const sessionId = auth(env).parseRequestHeaders({
    headers: {
      cookie: request.headers.get("Cookie"),
      origin: request.headers.get("Origin"),
    },
    method: request.method,
    url: request.url,
  });

  // If there is no sessionId, redirect to the home page
  if (!sessionId) {
    return new Response(null, {
      headers: {
        Location: "/",
      },
    });
  }

  // Fetches session and user object from the database
  const { session, user } = await auth(env).validateSessionUser(sessionId);

  // Invalidate the session if it's expired
  if (session.state === "idle") {
    await auth(env).invalidateSession(session.sessionId);

    return new Response(null);
  }

  // Return the session with user object as Response
  return jsonResp(
    {
      ...session,
      user,
    },
    200,
  );
};
