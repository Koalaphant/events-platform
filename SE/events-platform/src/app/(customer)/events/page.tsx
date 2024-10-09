import { EventCard, EventCardSkeleton } from "@/components/EventCard";
import db from "@/db/db";
import { Suspense } from "react";

function getEvents() {
  return db.event.findMany({
    where: { isAvailable: true },
    orderBy: { name: "asc" },
  });
}

export default function page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense
        fallback={
          <>
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </>
        }
      >
        <EventsSuspense />
      </Suspense>
    </div>
  );
}

async function EventsSuspense() {
  const events = await getEvents();
  return events.map((event) => <EventCard key={event.id} {...event} />);
}
