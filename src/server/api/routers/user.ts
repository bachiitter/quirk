/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { z } from "zod";

import { auth } from "~/server/auth";
import { stripe } from "~/server/utils";

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
  subscription: protectedProcedure.query(async ({ ctx }) => {
    const freePlan = {
      name: "Free",
      description:
        "The free plan is limited to 3 posts. Upgrade to the PRO plan for unlimited posts.",
      stripePriceId: "",
    };

    const proPlan = {
      name: "PRO",
      description: "The PRO plan has unlimited posts.",
      stripePriceId: ctx.env.STRIPE_PRO_MONTHLY_PLAN_ID || "",
    };

    const user = await ctx.db
      .selectFrom("user")
      .where("id", "=", ctx.userId)
      .select([
        "stripe_subscription_id",
        "stripe_current_period_end",
        "stripe_customer_id",
        "stripe_price_id",
      ])
      .execute();
    if (!user) {
      throw new Error("User not found");
    }

    const isPro =
      user[0].stripe_price_id &&
      user[0].stripe_current_period_end?.getTime()! + 86_400_000 > Date.now();
    const plan = isPro ? proPlan : freePlan;

    let isCanceled = false;

    if (isPro && user[0].stripe_subscription_id) {
      const stripePlan = await stripe(ctx.env).subscriptions.retrieve(
        user[0].stripe_subscription_id,
      );
      isCanceled = stripePlan.cancel_at_period_end;
    }

    return {
      plan: plan,
      user: user,
      stripeCurrentPeriodEnd: user[0].stripe_current_period_end?.getTime(),
      isPro,
      isCanceled,
    };
  }),
  delete: protectedProcedure.mutation(async ({ ctx }) => {
    return await auth(ctx.env).deleteUser(ctx.userId);
  }),
});
