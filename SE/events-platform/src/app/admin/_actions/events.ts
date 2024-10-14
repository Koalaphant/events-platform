"use server";

import { z } from "zod";
import fs from "fs/promises";
import db from "@/db/db";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  name: z.string().min(1),
  priceInPence: z.coerce.number().int().min(0),
  description: z.string().min(1),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
  eventDate: z.coerce.date().transform((date) => date.toISOString()),
});

export async function addEvent(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  fs.mkdir("public/images", { recursive: true });
  const imagePath = `/images/${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  await db.event.create({
    data: {
      isAvailable: false,
      name: data.name,
      priceInPence: data.priceInPence,
      description: data.description,
      imagePath,
      eventDate: data.eventDate,
    },
  });

  revalidatePath("/");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function toggleEventAvailability(
  id: string,
  isAvailable: boolean
) {
  await db.event.update({
    where: { id },
    data: { isAvailable },
  });

  revalidatePath("/");
  revalidatePath("/events");
}

export async function deleteEvent(id: string) {
  const event = await db.event.delete({ where: { id } });

  if (event == null) return notFound();

  await fs.unlink(`public${event.imagePath}`);

  revalidatePath("/");
  revalidatePath("/events");
}

const editSchema = addSchema.extend({
  image: imageSchema.optional(),
});

export async function updateEvent(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const event = await db.event.findUnique({ where: { id } });

  if (event == null) return notFound();

  let imagePath = event.imagePath;

  if (data.image != null && data.image.size > 0) {
    await fs.unlink(`public${event.imagePath}`);
    imagePath = `/images/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
      `public${imagePath}`,
      Buffer.from(await data.image.arrayBuffer())
    );
  }

  await db.event.update({
    where: { id },
    data: {
      name: data.name,
      priceInPence: data.priceInPence,
      description: data.description,
      imagePath,
      eventDate: data.eventDate,
    },
  });

  revalidatePath("/");
  revalidatePath("/events");
  redirect("/admin/events");
}
