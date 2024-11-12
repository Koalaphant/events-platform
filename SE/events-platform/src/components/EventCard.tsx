import { formatCurrency, formatEventDate } from "@/lib/formatters";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

type EventCardProps = {
  id: string;
  name: string;
  priceInPence: number;
  description: string;
  imagePath: string;
  startTime: Date;
  location: string;
};

export function EventCard({
  id,
  name,
  priceInPence,
  description,
  imagePath,
  startTime,
  location,
}: EventCardProps) {
  return (
    <Card className="flex overflow-hidden flex-col">
      <div className="relative w-full h-auto aspect-video">
        <Image
          src={imagePath}
          fill
          alt={name}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{location}</CardDescription>
        <CardDescription>
          {formatEventDate(new Date(startTime).toISOString())}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="line-clamp-4">{description}</p>
      </CardContent>
      <CardContent className="flex-grow">
        {formatCurrency(priceInPence / 100)}
      </CardContent>
      <CardFooter>
        {priceInPence === 0 ? (
          <Button asChild size="lg" className="w-full">
            <Link href={`/events/${id}/register`}>Free</Link>
          </Button>
        ) : (
          <Button asChild size="lg" className="w-full">
            <Link href={`/events/${id}/purchase`}>Purchase</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col animate-pulse">
      <div className="w-full aspect-video bg-gray-300" />
      <CardHeader>
        <CardTitle>
          <div className="w-3/4 h-6 rounded-full bg-gray-300" />
        </CardTitle>
        <CardDescription>
          <span className="w-1/2 h-4 rounded-full bg-gray-300" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-full h-4 rounded-full bg-gray-300" />
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled size="lg"></Button>
      </CardFooter>
    </Card>
  );
}
