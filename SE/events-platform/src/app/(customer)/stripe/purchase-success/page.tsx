import db from "@/db/db";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import AddToGoogleCalendar from "../../events/_components/AddToGoogleCalendar";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );

  if (paymentIntent.metadata.eventId == null) return notFound();

  const event = await db.event.findUnique({
    where: {
      id: paymentIntent.metadata.eventId,
    },
  });

  if (event == null) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";

  const formattedEvent = {
    ...event,
    startTime: event.startTime.toISOString(),
    endTime: event.endTime.toISOString(),
  };

  console.log(formattedEvent);

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className="text-4xl font-bold">
        {isSuccess ? "You're going to the event!" : "Failed to purchase"}
      </h1>
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            src={formattedEvent.imagePath}
            alt={formattedEvent.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(formattedEvent.priceInPence / 100)}
          </div>
          <h1 className="text-2xl font-bold">{formattedEvent.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {formattedEvent.description}
          </div>
          <div>
            <AddToGoogleCalendar event={formattedEvent} />
          </div>
        </div>
      </div>
    </div>
  );
}
