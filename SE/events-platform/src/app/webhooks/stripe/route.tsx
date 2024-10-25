import db from "@/db/db";
import PurchaseReceiptEmail from "@/email/PurchaseReceipt";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  const stripeEvent = event as Stripe.Event;

  if (stripeEvent.type === "charge.succeeded") {
    const charge = stripeEvent.data.object as Stripe.Charge;
    const eventId = charge.metadata.eventId;
    const email = charge.billing_details.email;
    const pricePaidInPence = charge.amount;

    const event = await db.event.findUnique({
      where: {
        id: eventId,
      },
    });
    if (event === null || email == null) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const userFields = {
      email,
      orders: { create: { eventId, pricePaidInPence } },
    };

    const {
      orders: [order],
    } = await db.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    await resend.emails.send({
      from: `Splend Event Support <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: "Your ticket is confirmed",
      react: <PurchaseReceiptEmail order={order} event={event} />,
    });

    return new NextResponse();
  }
}
