import { put } from "@vercel/blob";
import db from "@/db/db";

// Function to clear all tables
export async function clearDatabase() {
  await db.order.deleteMany({});
  await db.user.deleteMany({});
  await db.event.deleteMany({});
}

// Ticketmaster API function
export async function fetchEventsFromTicketmaster() {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  const response = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&countryCode=GB&size=30&page=4&startDateTime=2025-01-22T00:00:00Z&endDateTime=2026-12-31T23:59:59Z`
  );

  const data = await response.json();

  // Check if events exist
  if (!data._embedded || !data._embedded.events) {
    return []; // Return an empty array if no events found
  }

  // Use a Map to track unique event names
  const uniqueEvents = new Map();

  for (const event of data._embedded.events) {
    // Add the event to the Map if the name is not already present
    if (!uniqueEvents.has(event.name)) {
      uniqueEvents.set(event.name, event);
    }
  }

  // Convert the Map back to an array and return the unique events
  return Array.from(uniqueEvents.values());
}

// Seeding function
export async function seedEventsFromTicketmaster() {
  // Clear all tables before starting
  await clearDatabase();

  const events = await fetchEventsFromTicketmaster();

  for (const ticketmasterEvent of events) {
    const eventData = {
      name: ticketmasterEvent.name,
      description: ticketmasterEvent.info || "No description available",
      location: ticketmasterEvent._embedded.venues[0].name,
      priceInPence: Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000,
      startTime: new Date(
        new Date(ticketmasterEvent.dates.start.dateTime).getFullYear(),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
        new Date(ticketmasterEvent.dates.start.dateTime).getHours(),
        new Date(ticketmasterEvent.dates.start.dateTime).getMinutes(),
        new Date(ticketmasterEvent.dates.start.dateTime).getSeconds()
      ).toISOString(),
      endTime: new Date(
        ticketmasterEvent.dates.end?.dateTime ||
          ticketmasterEvent.dates.start.dateTime
      ).toISOString(),
      image: (await fetch(ticketmasterEvent.images[0].url).then((res) =>
        res.blob()
      )) as File,
    };

    // Upload image using the existing upload function
    const blob = await uploadImageToVercelBlob(eventData.image);

    // Save event to DB
    const newEvent = await db.event.create({
      data: {
        name: eventData.name,
        description: eventData.description,
        location: eventData.location,
        priceInPence: eventData.priceInPence,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        imagePath: blob.url,
        isAvailable: true,
      },
    });

    // Create a new user for each event
    const newUser = await db.user.create({
      data: {
        email: `user${crypto.randomUUID()}@example.com`, // Random user email
      },
    });

    // Create an order for that user associated with the event
    await db.order.create({
      data: {
        pricePaidInPence: newEvent.priceInPence,
        userId: newUser.id,
        eventId: newEvent.id,
      },
    });
  }
}

// Function to upload images using Vercel Blob
export async function uploadImageToVercelBlob(
  imageFile: File
): Promise<{ url: string }> {
  const filename = `${crypto.randomUUID()}-${imageFile.name}`;
  const blob = await put(filename, imageFile.stream(), {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return { url: blob.url };
}
