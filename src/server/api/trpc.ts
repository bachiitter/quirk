import type { inferAsyncReturnType } from "@trpc/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";

import { auth } from "../auth";
import { initDB } from "../db";
import type { Env } from "../env";

export const t = initTRPC
  .context<inferAsyncReturnType<typeof createContext>>()
  .create({
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.code === "BAD_REQUEST" && error.cause instanceof ZodError
              ? error.cause.flatten()
              : null,
        },
      };
    },
  });

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      userId: ctx.session.user.userId,
      session: ctx.session,
    },
  });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);

interface ContextProps {
  env: Env;
  req: Request;
}

export function createContext({ env, req }: ContextProps) {
  const DB = initDB(env);

  const headers = new Headers();

  const getSession = async (req: Request) => {
    // Handles request
    const authRequest = auth(env).handleRequest(req, headers);

    // Fetches session and user object from the database
    const session = await authRequest.validate();

    return session;
  };

  return async () => {
    return {
      env,
      req: req,
      db: DB,
      session: await getSession(req),
    };
  };
}
