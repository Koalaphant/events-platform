import db from "@/db/db";
import { formatCurrency, formatEventTime } from "@/lib/formatters";
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

  return (
    <div className="max-w-5xl w-full mx-auto">
      <h1 className="text-4xl font-bold text-center mb-20">
        {isSuccess ? `You're going to ${event.name}!` : "Failed to purchase"}
      </h1>

      <div className="flex justify-between w-full">
        <div className="w-1/2">
          <div className="relative w-full aspect-video">
            <Image
              src={formattedEvent.imagePath}
              alt={formattedEvent.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center">
          <div className="text-lg">
            {formatCurrency(formattedEvent.priceInPence / 100)}
          </div>
          <h1 className="text-2xl font-bold text-center">
            {formattedEvent.name}
          </h1>
          <div className="mb-3">
            {formatEventTime(event.startTime.toString())} -{" "}
            {formatEventTime(event.endTime.toString())}
          </div>
          <div className="line-clamp-3 text-muted-foreground text-center">
            {formattedEvent.description}
          </div>
          <div className="mt-4">
            <AddToGoogleCalendar event={formattedEvent} />
          </div>
        </div>
      </div>
    </div>
  );
}
