import db from "@/db/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import { CheckoutForm } from "./_components/CheckoutForm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const event = await db.event.findUnique({
    where: { id },
  });

  if (event == null) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: event.priceInPence,
    currency: "gbp",
    metadata: {
      eventId: event.id,
    },
  });

  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent");
  }

  return (
    <CheckoutForm event={event} clientSecret={paymentIntent.client_secret} />
  );
}
