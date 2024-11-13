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
  const [startTime, setStartTime] = useState<string>(
    event ? new Date(event.startTime).toISOString().slice(0, 16) : ""
  );
  const [endTime, setEndTime] = useState<string>(
    event ? new Date(event.endTime).toISOString().slice(0, 16) : ""
  );

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="name">
          Name<span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={event?.name || ""}
        />
        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">
          Location<span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          id="location"
          name="location"
          required
          defaultValue={event?.location || ""}
        />
        {error.location && (
          <div className="text-destructive">{error.location}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="startTime">
          Start Time<span className="text-red-500">*</span>
        </Label>
        <Input
          type="datetime-local"
          id="startTime"
          name="startTime"
          required
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        {error.startTime && (
          <div className="text-destructive">{error.startTime}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="endTime">
          End Time<span className="text-red-500">*</span>
        </Label>
        <Input
          type="datetime-local"
          id="endTime"
          name="endTime"
          required
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        {error.endTime && (
          <div className="text-destructive">{error.endTime}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInPence">
          Price In Pence<span className="text-red-500">*</span>
        </Label>
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
        <Label htmlFor="description">
          Description<span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={event?.description}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">
          Image<span className="text-red-500">*</span>
        </Label>
        <Input type="file" id="image" name="image" />
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
