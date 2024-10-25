"use server";

import db from "@/db/db";
import OrderHistoryEmail from "@/email/OrderHistory";
import { Resend } from "resend";
import { z } from "zod";

const emailSchema = z.string().email();
const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function emailOrderHistory(
  prevState: unknown,
  formData: FormData
): Promise<{ message?: string; error?: string }> {
  const result = emailSchema.safeParse(formData.get("email"));

  if (result.success === false) {
    return { error: "Invalid email address" };
  }

  const user = await db.user.findUnique({
    where: { email: result.data },
    select: {
      email: true,
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
            },
          },
        },
      },
    },
  });

  if (user == null) {
    return {
      error:
        "Check your email to send your order history and download your tickets",
    };
  }

  const orders = user.orders.map((order) => {
    return { ...order };
  });

  await resend.emails.send({
    from: `SplendEvent Support <${process.env.SENDER_EMAIL}>`,
    to: user.email,
    subject: "Order History",
    react: <OrderHistoryEmail orders={await Promise.all(orders)} />,
  });

  return {
    message:
      "Check your email to view your order history and download your tickets",
  };
}
