"use server";

import db from "@/db/db";

export async function userOrderExists(userId: string, eventId: string) {
  return (
    (await db.order.findFirst({
      where: { userId, eventId }, // Use userId to check for existing order
      select: { id: true },
    })) != null
  );
}
