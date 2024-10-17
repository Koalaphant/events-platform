import db from "@/db/db";
import { formatCurrency, formatEventDate } from "@/lib/formatters";
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
      <h1 className="text-5xl font-bold text-center">
        {isSuccess ? `Your event details` : "Failed to purchase"}
      </h1>
      <p className="text-lg font-light text-center mt-2 mb-20">
        You paid {formatCurrency(formattedEvent.priceInPence / 100)} for the
        event.
      </p>

      <div className="flex flex-col md:flex-row justify-between w-full md:space-y-0">
        <div className="w-full md:w-1/2">
          <div className="relative w-full aspect-video">
            <Image
              src={formattedEvent.imagePath}
              alt={formattedEvent.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-primary p-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
            {formattedEvent.name}
          </h1>
          <div className="text-white text-center">
            {formatEventDate(event.startTime.toString())}
          </div>
          <div className="line-clamp-3 text-white text-center mb-4">
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
