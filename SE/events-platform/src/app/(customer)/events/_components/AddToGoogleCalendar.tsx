import { Button } from "@/components/ui/button";
import React from "react";

interface Event {
  startTime: string;
  name: string;
  description: string;
  location: string;
}

type EventProps = {
  event: Event;
};

const AddToGoogleCalendar: React.FC<EventProps> = ({ event }) => {
  const googleCalendarLink = createGoogleCalendarLink(event);

  return (
    <a href={googleCalendarLink} target="_blank" rel="noopener noreferrer">
      <Button className="bg-primary text-white py-2 px-4 hover:animate-pulse">
        Add to Google Calendar <span className="text-sm ml-3">🗓️</span>
      </Button>
    </a>
  );
};

const createGoogleCalendarLink = (event: Event) => {
  const startTime = new Date(event.startTime)
    .toISOString()
    .replace(/-|:|\.\d+/g, "")
    .slice(0, 15); // Format: YYYYMMDDTHHMMSS

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    event.name
  )}&dates=${startTime}/${startTime}&details=${encodeURIComponent(
    event.description
  )}&location=${encodeURIComponent(event.location)}`;
};

export default AddToGoogleCalendar;
