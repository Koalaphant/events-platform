import { put } from "@vercel/blob";
import db from "@/db/db";

export async function clearDatabase() {
  await db.order.deleteMany({});
  await db.user.deleteMany({});
  await db.event.deleteMany({});
}

export async function fetchEventsFromTicketmaster() {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  const response = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&countryCode=GB&size=30&page=4&startDateTime=2025-01-22T00:00:00Z&endDateTime=2026-12-31T23:59:59Z`
  );

  const data = await response.json();

  if (!data._embedded || !data._embedded.events) {
    return [];
  }

  const uniqueEvents = new Map();
  for (const event of data._embedded.events) {
    if (!uniqueEvents.has(event.name)) {
      uniqueEvents.set(event.name, event);
    }
  }

  return Array.from(uniqueEvents.values());
}

export async function seedEventsFromTicketmaster() {
  await clearDatabase();

  const events = await fetchEventsFromTicketmaster();
  console.log(`Fetched ${events.length} events from Ticketmaster.`);

  for (const ticketmasterEvent of events) {
    const eventData = {
      name: ticketmasterEvent.name,
      description:
        ticketmasterEvent.info ||
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus tempus lectus sit amet ante scelerisque varius. Proin tristique diam quis.",
      location: ticketmasterEvent._embedded.venues[0].name,
      priceInPence: Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000,
      startTime: new Date(ticketmasterEvent.dates.start.dateTime).toISOString(),
      endTime: new Date(
        ticketmasterEvent.dates.end?.dateTime ||
          ticketmasterEvent.dates.start.dateTime
      ).toISOString(),
      image: (await fetch(ticketmasterEvent.images[0].url).then((res) =>
        res.blob()
      )) as File,
    };

    const blob = await uploadImageToVercelBlob(eventData.image);
    console.log("Image uploaded to:", blob.url);

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

    const newUser = await db.user.create({
      data: {
        email: `user${crypto.randomUUID()}@example.com`,
      },
    });

    await db.order.create({
      data: {
        pricePaidInPence: newEvent.priceInPence,
        userId: newUser.id,
        eventId: newEvent.id,
      },
    });
  }
}

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
