"use client";

import { FiClock, FiMapPin, FiTag } from "react-icons/fi";
import { userOrderExists } from "@/app/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatEventTime } from "@/lib/formatters";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import Link from "next/link";

type CheckoutFormProps = {
  event: {
    id: string;
    imagePath: string;
    name: string;
    priceInPence: number;
    description: string;
    location: string;
    startTime: Date;
    endTime: Date;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  clientSecret: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export function CheckoutForm({ event, clientSecret }: CheckoutFormProps) {
  return (
    <div className="max-w-5xl w-full md:mx-auto space-y-8 md:mt-20 mx-0">
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
      <div className="mx-4 lg:mx-0">
        <SignedIn>
          <Elements options={{ clientSecret }} stripe={stripePromise}>
            <Form priceInPence={event.priceInPence} eventId={event.id} />
          </Elements>
        </SignedIn>
        <SignedOut>
          <div className="flex flex-col text-center mt-20 gap-5">
            <p className="font-bold text-2xl">
              Please sign in to purchase your ticket!
            </p>
            <Button asChild>
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

function Form({
  priceInPence,
  eventId,
}: {
  priceInPence: number;
  eventId: string;
}) {
  const { userId } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (stripe == null || elements == null || !userId) return;

    setIsLoading(true);

    const orderExists = await userOrderExists(userId, eventId); // Check using user.id

    if (orderExists) {
      setErrorMessage("You have already purchased this event");
      setIsLoading(false);
      return;
    }

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occurred");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={stripe == null || elements == null || isLoading}
          >
            {isLoading
              ? "Purchasing..."
              : `Purchase - ${formatCurrency(priceInPence / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
