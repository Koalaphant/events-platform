import db from "@/db/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import { CheckoutForm } from "./_components/CheckoutForm";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { userId } = await auth();

  const event = await db.event.findUnique({
    where: { id },
  });

  if (event == null) return notFound();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: event.priceInPence,
    currency: "gbp",
    metadata: {
      eventId: event.id,
      userId: userId,
    },
  });

  if (paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent");
  }

  return (
    <div>
      <CheckoutForm event={event} clientSecret={paymentIntent.client_secret} />
    </div>
  );
}
