import { serialize } from "cookie";

import { githubProvider } from "~/server/auth";
import type { Env } from "~/server/env";
import { jsonResp } from "~/server/utils";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method !== "GET") {
    return jsonResp({ error: "Method not allowed" }, 405);
  }

  // Get the authorization URL
  const [url, state] = await githubProvider(env).getAuthorizationUrl();

  // Set the state in a cookie for validation and redirect to the authorization URL.

  return new Response("", {
    status: 302,
    headers: {
      Location: url.toString(),
      "Set-Cookie": serialize("oauth_state", state, {
        path: "/",
        httpOnly: true,
        secure: env.ENVIRONMENT === "DEV" ? false : true,
      }),
    },
  });
};
