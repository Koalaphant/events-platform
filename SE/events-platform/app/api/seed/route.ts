// app/api/seed/route.ts

import { db } from "@/lib/db";
import { eventsData } from "./eventsData";

export async function POST() {
  const isDevelopment = process.env.NODE_ENV === "development";

  const apiKey = process.env.NEXT_PUBLIC_TICKETMASTER_CONSUMER_KEY;
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=Comedy&city=London&size=1&locale=*&apikey=${apiKey}`;

  // try {
  //   const response = await fetch(url);

  //   if (!response.ok) {
  //     throw new Error(`HTTP error. Status: ${response.status}`);
  //   }

  //   const data = await response.json();

  //   // Corrected logging statement to access the expected path
  //   // console.log(JSON.stringify(data._embedded, null, 2));
  //   console.log(process.env.NODE_ENV);

  //   // You may want to check if _embedded and events exist
  //   if (data._embedded && data._embedded.events) {
  //     console.log(`Number of events found: ${data._embedded.events.length}`);
  //   } else {
  //     console.log("No events found in the response.");
  //   }
  // } catch (error) {
  //   console.log("Error fetching data:", error);
  // }

  // return new Response(JSON.stringify({ message: "Test" }), { status: 200 });
  // Check if not in development mode
  if (!isDevelopment) {
    return new Response(
      JSON.stringify({ message: "Unauthorized or not in development mode." }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    if (!eventsData.length) {
      return new Response(
        JSON.stringify({ message: "No events data provided." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

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
