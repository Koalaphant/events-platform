import Link from "next/link";
import React from "react";

export default function NavBar() {
  return (
    <div className="flex justify-between items-center p-4 bg-rose-500 text-white">
      <div>
        <h1 className="text-4xl font-extralight">
          Splend<span className="font-semibold">Event</span>
        </h1>
      </div>
      <div>
        <Link href="/">Events</Link>
      </div>
    </div>
  );
}
