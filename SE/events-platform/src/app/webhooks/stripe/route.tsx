import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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
    const userId = charge.metadata.userId;
    const pricePaidInPence = charge.amount;

    const event = await db.event.findUnique({
      where: { id: eventId },
    });

    if (event === null) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const existingOrder = await db.order.findFirst({
      where: {
        userId,
        eventId,
      },
    });

    if (existingOrder) {
      return new NextResponse("You have already purchased this event", {
        status: 400,
      });
    }

    const userFields = {
      id: userId,
      orders: { create: { eventId, pricePaidInPence } },
    };

    await db.user.upsert({
      where: { id: userId },
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    return NextResponse.json({ success: true });
  } else {
    return new NextResponse("Event type received but not processed", {
      status: 200,
    });
  }

  return new NextResponse("Event type not handled", { status: 200 });
}
