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
    <div className="w-full">
      {" "}
      {/* Ensure full width but contained */}
      <form
        action={action}
        className="flex flex-col gap-2 mt-4 w-full max-w-md mx-auto"
      >
        {" "}
        {/* Max width with centering */}
        <Input type="hidden" name="eventId" value={event.id} />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full"
        />{" "}
        {/* Full width input */}
        {data.error && <div className="text-destructive">{data.error}</div>}
        {data.message ? (
          <p className="text-center">{data.message}</p>
        ) : (
          <Button type="submit" className="w-full">
            Register
          </Button>
        )}
      </form>
      <div className="flex justify-center mt-4">
        {data.message && (
          <AddToGoogleCalendar
            event={{
              name: event.name,
              startTime: event.startTime,
              location: event.location,
              description: event.description,
            }}
          />
        )}
      </div>
    </div>
  );
}
