import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";

import type { Env } from "../env";
import type { DB as Database } from "./schema";

export function initDB(env: Env) {
  const db = new Kysely<Database>({
    dialect: new PlanetScaleDialect({
      url: env.DATABASE_URL,
      //@ts-expect-error Removes fetch cache
      fetch: (url: string, init: RequestInit<RequestInitCfProperties>) => {
        delete (init as any).cache; // Remove cache header
        return fetch(url, init);
      },
    }),
  });

  return db;
}

export type DB = ReturnType<typeof initDB>;
