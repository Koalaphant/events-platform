"use server";

import { z } from "zod";
import { put } from "@vercel/blob";
import db from "@/db/db";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

interface EventData {
  name: string;
  priceInPence: number;
  description: string;
  location: string;
  image: File;
  startTime: string;
  endTime: string;
}

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  name: z.string().min(1),
  priceInPence: z.coerce.number().int().min(0),
  description: z.string().min(1),
  location: z.string().min(1),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
  startTime: z.coerce.date().transform((date) => date.toISOString()),
  endTime: z.coerce.date().transform((date) => date.toISOString()),
});

async function uploadImageToVercelBlob(
  imageFile: File
): Promise<{ url: string }> {
  const filename = `${crypto.randomUUID()}-${imageFile.name}`;
  const blob = await put(filename, imageFile.stream(), {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return { url: blob.url };
}

export async function addEvent(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const data: EventData = result.data;

  const blob = await uploadImageToVercelBlob(data.image);

  await db.event.create({
    data: {
      isAvailable: false,
      name: data.name,
      priceInPence: data.priceInPence,
      description: data.description,
      location: data.location,
      imagePath: blob.url, // Store the blob URL
      startTime: data.startTime,
      endTime: data.endTime,
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

  if (!event) return notFound();

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
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const data: Partial<EventData> = result.data;
  const event = await db.event.findUnique({ where: { id } });

  if (!event) return notFound();

  let imagePath = event.imagePath;

  if (data.image && data.image.size > 0) {
    const blob = await uploadImageToVercelBlob(data.image);
    imagePath = blob.url;
  }
  await db.event.update({
    where: { id },
    data: {
      name: data.name,
      priceInPence: data.priceInPence,
      description: data.description,
      location: data.location,
      imagePath,
      startTime: data.startTime,
      endTime: data.endTime,
    },
  });

  revalidatePath("/");
  revalidatePath("/events");
  redirect("/admin/events");
}
