"use client";
import freeRegister from "@/actions/free-register";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";
import { useAuth } from "@clerk/nextjs"; // Import useAuth for accessing userId
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
  const { userId } = useAuth(); // Get user from Clerk
  const [data, action] = useFormState(freeRegister, {});

  // Ensure user is authenticated before rendering form
  if (!userId) {
    return <p>You must be logged in to register for the event.</p>;
  }

  return (
    <div className="w-full">
      <form
        action={action}
        className="flex flex-col gap-2 mt-4 w-full max-w-md mx-auto"
      >
        <input type="hidden" name="eventId" value={event.id} />
        <input type="hidden" name="userId" value={userId} /> {/* Pass userId */}
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