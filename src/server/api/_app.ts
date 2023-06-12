import { z } from "zod";

import { protectedProcedure, publicProcedure, t } from "./trpc";

export const appRouter = t.router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }))
    .query(({ input }) => {
      return {
        greeting: `Hello from tRPC, ${input.text ?? "Anonymous"}`,
      };
    }),
  secretMessage: protectedProcedure.query(() => {
    return "This is a secret message";
  }),
});

export type AppRouter = typeof appRouter;
