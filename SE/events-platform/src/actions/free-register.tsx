"use server";

import db from "@/db/db";
import { z } from "zod";

const eventIdSchema = z.string();
const userIdSchema = z.string();

export default async function freeRegister(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const eventId = formData.get("eventId") as string;
  const userId = formData.get("userId") as string;

  const eventResult = eventIdSchema.safeParse(eventId);
  const userResult = userIdSchema.safeParse(userId);

  if (!eventResult.success || !userResult.success) {
    return { error: "Invalid data" };
  }

  const event = await db.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    return { error: "Event not found" };
  }

  const orderExists = await db.order.findFirst({
    where: { eventId, userId },
  });

  if (orderExists) {
    return { error: "You are already registered for this event." };
  }

  const orderFields = {
    pricePaidInPence: 0,
    userId,
    eventId,
  };

  await db.order.create({
    data: orderFields,
  });

  return {
    message: "You have successfully registered for the event!",
  };
}