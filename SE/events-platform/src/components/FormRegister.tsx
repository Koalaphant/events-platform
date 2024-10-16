"use client";
import freeRegister from "@/actions/free-register";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import AddToGoogleCalendar from "@/app/(customer)/events/_components/AddToGoogleCalendar";

type Event = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
};

export default function FormRegister({ event }: { event: Event }) {
  const [data, action] = useFormState(freeRegister, {});

  return (
    <div>
      <form action={action} className="flex flex-col gap-2 mt-4">
        <Input type="hidden" name="eventId" value={event.id} />
        <Input type="email" name="email" placeholder="Email" required />
        {data.error && <div className="text-destructive">{data.error}</div>}
        {data.message ? (
          <p className="text-center">{data.message}</p>
        ) : (
          <Button type="submit">Register</Button>
        )}
      </form>
      <div className="flex justify-center">
        {data.message && (
          <AddToGoogleCalendar
            event={{
              name: event.name,
              startTime: event.startTime,
              endTime: event.endTime,
              location: event.location,
              description: event.description,
            }}
          />
        )}
      </div>
    </div>
  );
}
