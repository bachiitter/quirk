import { auth } from "~/server/auth";
import type { Env } from "~/server/env";
import { jsonResp } from "~/server/utils";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const headers = new Headers();

  // Handles request
  const authRequest = auth(env).handleRequest(request, headers);

  // Fetches session and user object from the database
  const session = await authRequest.validate();

  // If there is no sessionId, redirect to the home page
  if (!session) {
    return new Response(null, {
      headers: {
        Location: "/",
      },
    });
  }
  // Invalidate the session if it's expired
  if (session.state === "idle") {
    await auth(env).invalidateSession(session.sessionId);

    return new Response(null);
  }

  // Return the session with user object as Response
  return jsonResp(session, 200);
};
