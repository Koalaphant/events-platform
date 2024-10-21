import { EventCard, EventCardSkeleton } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Event } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Hero } from "./events/_components/HeroSection";

const getMostPopularEvents = cache(
  () => {
    return db.event.findMany({
      where: { isAvailable: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    });
  },
  ["/", "getMostPopularEvents"],
  { revalidate: 60 * 60 * 24 }
);

const getNewestEvents = cache(
  () => {
    return db.event.findMany({
      where: { isAvailable: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  },
  ["/", "getNewestEvents"],
  { revalidate: 60 * 60 * 24 }
);

export default function Home() {
  return (
    <div>
      <div>
        <Hero />
      </div>
      <div className="sm:mx-6 max-w-7xl lg:mx-auto">
        <main className="space-y-12">
          <EventGridSection
            title={"Most Popular Events"}
            eventsFetcher={getMostPopularEvents}
          />
          <EventGridSection
            title={"Newest Events"}
            eventsFetcher={getNewestEvents}
          />
        </main>
      </div>
    </div>
  );
}

type EventGridSectionProps = {
  title: string;
  eventsFetcher: () => Promise<Event[]>;
};

function EventGridSection({ eventsFetcher, title }: EventGridSectionProps) {
  return (
    <div className="space-y-4 px-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href={"/events"} className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        <Suspense
          fallback={
            <>
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </>
          }
        >
          <EventSuspense eventsFetcher={eventsFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

async function EventSuspense({
  eventsFetcher,
}: {
  eventsFetcher: () => Promise<Event[]>;
}) {
  return (await eventsFetcher()).map((event) => (
    <EventCard key={event.id} {...event} />
  ));
}
