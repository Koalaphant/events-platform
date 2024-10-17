// /app/api/seed/route.ts
import { NextResponse } from "next/server";
import { seedEventsFromTicketmaster } from "@/lib/seedFunctions";
import { revalidatePath } from "next/cache";

export async function POST() {
  try {
    await seedEventsFromTicketmaster();

    revalidatePath("/");
    revalidatePath("/events");

    return NextResponse.json({ message: "Seeding complete" });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed the database" },
      { status: 500 }
    );
  }
}
