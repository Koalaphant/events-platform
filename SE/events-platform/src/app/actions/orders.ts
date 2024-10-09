"use server";

import db from "@/db/db";

export async function userOrderExists(email: string, eventId: string) {
  return (
    (await db.order.findFirst({
      where: { user: { email }, eventId },
      select: { id: true },
    })) != null
  );
}
