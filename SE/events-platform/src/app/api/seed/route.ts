import { NextResponse } from "next/server";
import { seedEventsFromTicketmaster } from "@/lib/seedFunctions";
import db from "@/db/db";

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key");
  if (apiKey !== process.env.SEED_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await seedEventsFromTicketmaster();
    return NextResponse.json({ message: "Database seeded successfully!" });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Error seeding database" },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
