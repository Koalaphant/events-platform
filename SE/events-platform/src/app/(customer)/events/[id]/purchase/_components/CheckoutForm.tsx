"use client";

import { FiClock, FiMapPin, FiTag, FiFileText } from "react-icons/fi";
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
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { FormEvent, useState } from "react";

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
    <div className="max-w-5xl w-full mx-auto space-y-8">
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
          <h1 className="text-2xl font-bold mb-4">{event.name}</h1>
          <ul className="space-y-1">
            <li className="flex items-center">
              <FiClock className="mr-2 text-primary" />
              {formatEventTime(event.startTime.toString())}
            </li>
            <li className="flex items-center">
              <FiMapPin className="mr-2 text-primary" />
              {event.location}
            </li>
            <li className="flex items-center">
              <FiFileText className="mr-2 text-primary" />
              <div className="line-clamp-3">{event.description}</div>
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
      <Elements options={{ clientSecret }} stripe={stripePromise}>
        <Form priceInPence={event.priceInPence} eventId={event.id} />
      </Elements>
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
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (stripe == null || elements == null || email == null) return;

    setIsLoading(true);

    const orderExists = await userOrderExists(email, eventId);

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
          setErrorMessage("An unknown error occured");
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
          <div className="mt-4">
            <LinkAuthenticationElement
              onChange={(e) => setEmail(e.value.email)}
            />
          </div>
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
