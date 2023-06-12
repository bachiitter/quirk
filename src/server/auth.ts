import { planetscale } from "@lucia-auth/adapter-mysql";
import { github } from "@lucia-auth/oauth/providers";
import { connect } from "@planetscale/database";
import { lucia } from "lucia";
import { web } from "lucia/middleware";

import type { Env } from "./env";

/**
 * Config Options for Lucia for adapters, middlewars etc.
 * @see https://lucia-auth.com/basics/configuration
 **/

export const auth = (env: Env) => {
  // Initialize PlanetScale client
  const connection = connect({
    url: env.DATABASE_URL,
    //@ts-expect-error Removes fetch cache
    fetch: (url: string, init: RequestInit<RequestInitCfProperties>) => {
      delete (init as any).cache; // Remove cache header
      return fetch(url, init);
    },
  });

  return lucia({
    // Database Adapter
    adapter: planetscale(connection, {
      key: "key",
      session: "session",
      user: "user",
    }),
    // Environment
    env: env.ENVIRONMENT === "DEV" ? "DEV" : "PROD",
    // Web Middleware because of Cloudflare Workers
    middleware: web(),
    // Generate a random UUID for UserId on User SignUp
    generateUserId: () => crypto.randomUUID(),

    // Properties for User Object
    getUserAttributes: (databaseUser) => {
      return {
        name: databaseUser.name,
        username: databaseUser.username,
        email: databaseUser.email,
        image: databaseUser.image,
        provider: databaseUser.provider,
      };
    },
    getSessionAttributes: (sessionData) => {
      return {
        createdAt: sessionData.created_at,
      };
    },
    experimental: {
      // Enables Lucia Debug Mode in Dev Environment
      debugMode: env.ENVIRONMENT === "DEV" ? true : false,
    },
  });
};

/**
 * Wrapper for `proivder` to pass env variables
 *
 **/
export const githubProvider = (env: Env) => {
  /**
   * Config Options for providers
   * Google and Github is used here as an example
   * @see https://lucia-auth.com/oauth/providers/github?
   **/

  const redirectUri = `${env.LUCIA_AUTH_URL}/api/auth/callback/github`;

  return github(auth(env), {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    redirectUri,
  });
};

// Export type definition of auth for lucia.d.ts
export type Auth = ReturnType<typeof auth>;
