"use client";
import freeRegister from "@/actions/free-register";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFormState } from "react-dom";

type Event = {
  id: string;
};

export default function FormRegister({ event }: { event: Event }) {
  const [data, action] = useFormState(freeRegister, {});
  return (
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
  );
}
