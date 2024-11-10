"use server";

import db from "@/db/db";
import OrderHistoryEmail from "@/email/OrderHistory";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const email = formData.get("email") as string;
  const userId = formData.get("userId") as string;

  const emailSchema = z.string().email();
  const result = emailSchema.safeParse(email);
  if (result.success === false) {
    return { error: "Invalid email address" };
  }

  const user = await db.user.findUnique({
    where: { id: userId }, // Using userId to fetch the user
    select: {
      orders: {
        select: {
          pricePaidInPence: true,
          id: true,
          createdAt: true,
          event: {
            select: {
              id: true,
              name: true,
              imagePath: true,
              description: true,
              startTime: true,
              location: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return { error: "User not found." };
  }

  const orders = user.orders.map((order) => ({
    ...order,
  }));

  await resend.emails.send({
    from: `SplendEvent Support <${process.env.SENDER_EMAIL}>`,
    to: email, // Email from form data
    subject: "Order History",
    react: <OrderHistoryEmail orders={orders} />,
  });

  return {
    message:
      "Check your email to view your order history and download your tickets.",
  };
}
