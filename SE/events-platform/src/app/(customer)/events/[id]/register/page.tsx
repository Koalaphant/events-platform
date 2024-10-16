import db from "@/db/db";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import freeRegister from "@/actions/free-register";
import FormRegister from "@/components/FormRegister";

export default async function Page({ params }: { params: { id: string } }) {
  const event = await db.event.findUnique({
    where: { id: params.id },
  });

  if (event == null) return notFound();
  return (
    <div className="">
      <h1 className="text-3xl font-bold text-center">
        Register your place for {event.name}
      </h1>
      <div className="flex flex-col lg:flex-row gap-4 mt-6">
        <div className="lg:w-1/2 w-full">
          <Image
            src={event.imagePath}
            alt={event.name}
            layout="responsive"
            width={1000}
            height={500}
            className="w-full"
          />
          <div className="bg-primary p-4 rounded-md mt-4">
            <p className="text-center text-white text-1xl leading-relaxed">
              {event.description}
            </p>
          </div>
        </div>
        <div className="lg:w-1/2 w-full">
          <p className="text-center text-muted-foreground">
            You are registering for a free event. Please enter your email
            address to confirm your place.
          </p>
          <FormRegister event={event} />
        </div>
      </div>
    </div>
  );
}


