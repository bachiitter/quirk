/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { z } from "zod";

import { auth } from "~/server/auth";
import { initDB } from "~/server/db";
import type { Env } from "~/server/env";
import { jsonResp, stripe } from "~/server/utils";

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const headers = new Headers();
    const db = initDB(env);

    const billingUrl = `${env.LUCIA_AUTH_URL}/dashboard/settings`;

    // Handles request
    const authRequest = auth(env).handleRequest(request, headers);

    // Fetches session and user object from the database
    const session = await authRequest.validate();
    if (!session?.user || !session.user.email) {
      return new Response(null, { status: 404 });
    }

    const user = await db
      .selectFrom("user")
      .where("id", "=", session.user.userId)
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

    if (isPro && user[0].stripe_subscription_id) {
      const stripeSession = await stripe(env).billingPortal.sessions.create({
        customer: user[0].stripe_customer_id!,
        return_url: billingUrl,
      });

      return jsonResp({ url: stripeSession.url }, 200);
    }

    const stripeSession = await stripe(env).checkout.sessions.create({
      success_url: billingUrl,
      cancel_url: billingUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: session.user.email,
      line_items: [
        {
          price: env.STRIPE_PRO_MONTHLY_PLAN_ID,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.userId,
      },
    });

    return jsonResp({ url: stripeSession.url }, 200);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    return new Response(null, { status: 500 });
  }
};
