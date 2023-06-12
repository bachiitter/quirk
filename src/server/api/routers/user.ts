import { z } from "zod";

import { auth } from "~/server/auth";

import { protectedProcedure, t } from "../trpc";

export const userRouter = t.router({
  profile: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .updateTable("user")
        .where("id", "=", ctx.userId)
        .set({
          name: input.name,
        })
        .executeTakeFirstOrThrow();
    }),
  password: protectedProcedure
    .input(
      z.object({
        oldPassword: z.string(),
        newPassword: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const provider = ctx.session?.user.provider!;
      const providerId = ctx.session?.user.provider_id!;

      const key = await auth(ctx.env).useKey(
        provider,
        providerId,
        input.oldPassword,
      );

      await auth(ctx.env).updateKeyPassword(
        key.providerId,
        key.providerUserId,
        input.newPassword,
      );
    }),
});
