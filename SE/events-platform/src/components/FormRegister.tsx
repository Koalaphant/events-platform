"use client";
import freeRegister from "@/actions/free-register";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Event = {
  id: string;
};

export default function FormRegister({ event }: { event: Event }) {
  return (
    <form action={freeRegister} className="flex gap-2 mt-4">
      <Input type="hidden" name="eventId" value={event.id} />
      <Input type="email" name="email" placeholder="Email" required />
      <Button type="submit">Register</Button>
    </form>
  );
}
