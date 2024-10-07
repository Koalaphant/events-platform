import { PageHeader } from "@/app/admin/_components/PageHeader";
import { EventForm } from "../../_components/EventForm";
import db from "@/db/db";

export default async function EditEventPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const event = await db.event.findUnique({ where: { id } });
  return (
    <>
      <PageHeader>Edit Event</PageHeader>
      <EventForm event={event} />
    </>
  );
}
