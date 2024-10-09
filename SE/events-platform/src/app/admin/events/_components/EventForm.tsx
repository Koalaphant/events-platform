"use client";

import { addEvent, updateEvent } from "@/app/admin/_actions/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Event } from "@prisma/client";
import Image from "next/image";

export function EventForm({ event }: { event?: Event | null }) {
  const [error, action] = useFormState(
    event == null ? addEvent : updateEvent.bind(null, event.id),
    {}
  );
  const [priceInPence, setPriceInPence] = useState<number | undefined>(
    event?.priceInPence || 0
  );
  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={event?.name || ""}
        ></Input>
        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInPence">Price In Pence</Label>
        <Input
          type="number"
          id="priceInPence"
          name="priceInPence"
          required
          value={priceInPence}
          onChange={(e) => setPriceInPence(Number(e.target.value) || undefined)}
        />
        <div className="text-muted-foreground">
          {formatCurrency((priceInPence || 0) / 100)}
        </div>
        {error.priceInPence && (
          <div className="text-destructive">{error.priceInPence}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={event?.description}
        ></Textarea>
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input
          type="file"
          id="image"
          name="image"
          required={event == null}
        ></Input>
        {event != null && (
          <Image
            src={event.imagePath}
            height={400}
            width={400}
            alt="Event Image"
          />
        )}
      </div>
      {error.image && <div className="text-destructive">{error.image}</div>}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}
