import db from "@/db/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import FormRegister from "@/components/FormRegister";
import { FiClock, FiMapPin, FiTag } from "react-icons/fi";
import { formatCurrency, formatEventTime } from "@/lib/formatters";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      <div className="flex flex-col md:flex-row gap-4 items-center m-0 md:m-4 lg:m-0">
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
          <ul className="space-y-1 mx-4 md:m-0">
            <li className="flex items-center">
              <FiClock className="mr-2 text-primary" />
              <div className="text-md">
                {formatEventTime(event.startTime.toString())}
              </div>
            </li>
            <li className="flex items-center">
              <FiMapPin className="mr-2 text-primary" />
              <div className="text-md">{event.location}</div>
            </li>

            <li className="flex items-center">
              <FiTag className="mr-2 text-primary" />
              <div className="text-md">
                {formatCurrency(event.priceInPence / 100)}
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-4 lg:mx-0">
        <p className="text-lg">{event.description}</p>
      </div>
      <div className="w-full">
        <SignedIn>
          <p className="text-center">
            You are registering for a free event. Please sign up by clicking the
            button below.
          </p>

          <FormRegister event={formattedEvent} />
        </SignedIn>
        <SignedOut>
          <div className="flex flex-col text-center mt-20 gap-5">
            <p className="font-bold text-2xl">
              Please sign in to purchase your ticket!
            </p>
            <Button>
              <Link className="text-xl py-7" href="/sign-in">
                Sign In
              </Link>
            </Button>
          </div>
        </SignedOut>
      </div>
    </div>
  );
}
