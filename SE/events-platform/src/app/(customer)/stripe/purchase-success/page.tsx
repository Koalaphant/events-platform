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
  console.log("Search Params:", searchParams);
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
    <div className="max-w-3xl w-full mx-auto mt-20">
      <h1 className="text-5xl font-bold text-center">
        {isSuccess ? `Your event details` : "Failed to purchase"}
      </h1>
      <p className="text-lg font-light text-center mt-2 mb-20">
        You paid {formatCurrency(formattedEvent.priceInPence / 100)} for the
        event.
      </p>

      <div>
        <div className="mx-4 border-2 border-primary rounded-lg">
          <div className="flex flex-col justify-center items-center text-white bg-primary px-6 py-8 gap-2">
            <h1 className="text-3xl font-bold text-center">
              {formattedEvent.name}
            </h1>
            <p className="text-center">
              {formatEventDate(event.startTime.toString())}
            </p>
            <p>{formattedEvent.location}</p>
            <p className="text-center">{formattedEvent.description}</p>
            <div className="flex gap-4 bg-white rounded-lg mt-4 p-1">
              <AddToGoogleCalendar event={formattedEvent} />
            </div>
          </div>
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <Image
              src={formattedEvent.imagePath}
              alt={formattedEvent.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
