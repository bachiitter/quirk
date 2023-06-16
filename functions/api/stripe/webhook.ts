import Stripe from "stripe";

import { initDB } from "~/server/db";
import type { Env } from "~/server/env";
import { stripe } from "~/server/utils";

export const webCrypto = Stripe.createSubtleCryptoProvider();

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const db = initDB(env);

  const body = await request.text();

  const signature = request.headers.get("Stripe-Signature")!;

  let event: Stripe.Event;

  try {
    event = await stripe(env).webhooks.constructEventAsync(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
      undefined,
      webCrypto,
    );
  } catch (error) {
    console.error(error);
    // @ts-expect-error Unkown
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe(env).subscriptions.retrieve(
      session.subscription as string,
    );

    // Update the user stripe into in our database.
    // Since this is the initial subscription, we need to update
    // the subscription id and customer id.

    await db
      .updateTable("user")
      .where("id", "=", session.metadata?.userId!)
      .set({
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        stripe_price_id: subscription.items.data[0].price.id,
        stripe_current_period_end: new Date(
          subscription.current_period_end * 1000,
        ),
      })
      .execute();
  }

  if (event.type === "invoice.payment_succeeded") {
    // Retrieve the subscription details from Stripe.
    const subscription = await stripe(env).subscriptions.retrieve(
      session.subscription as string,
    );

    // Update the price id and set the new period end.
    await db
      .updateTable("user")
      .where("stripe_subscription_id", "=", subscription.id)
      .set({
        stripe_price_id: subscription.items.data[0].price.id,
        stripe_current_period_end: new Date(
          subscription.current_period_end * 1000,
        ),
      })
      .execute();
  }

  return new Response(null, { status: 200 });
};
