"use server";

import { redirect } from "next/navigation";
import db from "@/db/db";
import { userOrderExists } from "@/app/actions/orders";

export default async function freeRegister(formData: FormData) {
  const email = formData.get("email") as string;
  const eventId = formData.get("eventId") as string;

  const event = await db.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    throw new Error("Event not found");
  }

  const orderExists = await userOrderExists(email, eventId);

  if (orderExists) {
    redirect("/");
    return;
  }

  // Create the new user/order since it doesn't exist
  const userFields = {
    email,
    orders: {
      create: {
        eventId,
        pricePaidInPence: 0,
      },
    },
  };

  await db.user.upsert({
    where: { email },
    create: userFields,
    update: userFields,
  });

  redirect("/");
}
