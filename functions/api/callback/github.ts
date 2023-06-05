import { parse } from "cookie";

import { auth, githubProvider } from "~/server/auth";
import type { Env } from "~/server/env";
import { jsonResp } from "~/server/utils";

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);

  // Fetch the auth code and state from request url
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // Fetch the stored state from cookie
  const { oauth_state: storedState } = parse(
    request.headers.get("Cookie") ?? "",
  );

  // Check for missing parameters and invalid state
  if (!code || !state || !storedState || storedState !== state) {
    return jsonResp(
      {
        error: "Invalid state",
      },
      400,
    );
  }

  try {
    // Validate the callback
    const { existingUser, providerUser, createUser } = await githubProvider(
      env,
    ).validateCallback(code);

    const getUser = async () => {
      // If existing user, return user data and update profile image,  refresh token and access token

      if (existingUser) {
        await auth(env).updateUserAttributes(existingUser.id, {
          // Update the user profile url everytime user logs in
          image: providerUser.avatar_url,
        });
        return existingUser;
      }

      // Create a new user
      return await createUser({
        name: providerUser.name,
        username: providerUser.login,
        email: providerUser.email,
        image: providerUser.avatar_url,
      });
    };

    const user = await getUser();

    const headers = new Headers();

    const authRequest = auth(env).handleRequest(request, headers);

    // Create a new session
    const session = await auth(env).createSession(user.id);

    //  Set the session in the request
    authRequest.setSession(session);

    //  Redirect to the dashboard
    headers.set("Location", "/dashboard");

    return new Response(null, {
      headers,
      status: 302,
    });
  } catch (e: unknown) {
    console.error(e);
    // Catch any errors and return a 500 response with the error
    return jsonResp(e, 500);
  }
};
