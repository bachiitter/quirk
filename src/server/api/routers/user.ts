/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
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
      const provider = ctx.session.user.provider;

      const keys = await auth(ctx.env).getAllUserKeys(ctx.userId);

      const providerKey = keys.find((p) => p.providerId === provider);

      const key = await auth(ctx.env).useKey(
        providerKey?.providerId!,
        providerKey?.providerUserId!,
        input.oldPassword,
      );

      await auth(ctx.env).updateKeyPassword(
        key.providerId,
        key.providerUserId,
        input.newPassword,
      );
    }),
});
