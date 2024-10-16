"use server";

import db from "@/db/db";
import { userOrderExists } from "@/app/actions/orders";
import { z } from "zod";
import PurchaseReceiptEmail from "@/email/PurchaseReceipt";
import { Resend } from "resend";

const emailSchema = z.string().email();
const resend = new Resend(process.env.RESEND_API_KEY as string);
export default async function freeRegister(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const email = formData.get("email") as string;
  const eventId = formData.get("eventId") as string;

  const result = emailSchema.safeParse(email);
  if (!result.success) {
    return { error: "Invalid email address" };
  }

  const event = await db.event.findUnique({
    where: {
      id: eventId,
    },
  });

  if (!event) {
    return { error: "Event not found" };
  }

  const orderExists = await userOrderExists(email, eventId);

  if (orderExists) {
    return { error: "You are already registered for this event." };
  }

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

  const order = await db.order.findFirst({
    where: { eventId, user: { email } },
    orderBy: { createdAt: "desc" },
  });

  if (!order) {
    return { error: "Order creation failed." };
  }

  await resend.emails.send({
    from: `SplendEvent Support <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: "Event Purchase Receipt",
    react: (
      <PurchaseReceiptEmail
        event={{
          name: event.name,
          imagePath: event.imagePath,
          description: event.description,
        }}
        order={{
          id: order.id,
          createdAt: order.createdAt,
          pricePaidInPence: order.pricePaidInPence,
        }}
      />
    ),
  });

  return {
    message: "You have successfully registered for the event!",
  };
}
