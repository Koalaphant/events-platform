import db from "@/db/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import FormRegister from "@/components/FormRegister";
import { FiClock, FiMapPin, FiTag, FiFileText } from "react-icons/fi";
import { formatCurrency, formatEventTime } from "@/lib/formatters";

export default async function Page({ params }: { params: { id: string } }) {
  const event = await db.event.findUnique({
    where: { id: params.id },
  });

  if (event == null) return notFound();

  const formattedEvent = {
    ...event,
    startTime: event.startTime.toISOString(),
    endTime: event.endTime.toISOString(),
  };

  return (
    <div className="max-w-5xl w-full  lg:mx-auto space-y-8 md:mt-20">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="aspect-video w-full md:w-1/3 relative">
          <Image
            src={event.imagePath}
            alt={event.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-4 mx-4 md:mx-0">{event.name}</h1>
          <ul className="space-y-1 m-4 md:m-0">
            <li className="flex items-center">
              <FiClock className="mr-2 text-primary" />
              <div className="text-lg">
                {formatEventTime(event.startTime.toString())} -{" "}
                {formatEventTime(event.endTime.toString())}
              </div>
            </li>
            <li className="flex items-center">
              <FiMapPin className="mr-2 text-primary" />
              <div className="text-lg">{event.location}</div>
            </li>
            <li className="flex items-center">
              <FiFileText className="mr-2 text-primary" />
              <div className="line-clamp-3 text-lg">{event.description}</div>
            </li>
            <li className="flex items-center">
              <FiTag className="mr-2 text-primary" />
              <div className="text-lg">
                {formatCurrency(event.priceInPence / 100)}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full">
        <p className="text-center text-muted-foreground">
          You are registering for a free event. Please enter your email address
          to confirm your place.
        </p>
        <FormRegister event={formattedEvent} />
      </div>
    </div>
  );
}
