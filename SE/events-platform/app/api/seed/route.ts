// app/api/seed/route.ts

import { db } from "@/lib/db"; // Adjust the import path as needed
import { eventsData } from "./eventsData"; // Import the event data

export async function POST() {
  try {
    // Check if events data is valid (if needed)
    if (!eventsData.length) {
      return new Response(
        JSON.stringify({ message: "No events data provided." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Seed the database with events
    const createdEvents = await Promise.all(
      eventsData.map((event) => db.event.create({ data: event }))
    );

    return new Response(JSON.stringify(createdEvents), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error seeding events:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
