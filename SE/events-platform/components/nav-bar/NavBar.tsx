import React from "react";
import NavLink from "./NavLinks";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Events", href: "/events" },
];

export default function NavBar() {
  return (
    <nav className="bg-slate-800 text-white">
      <div className="max-w-5xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-4xl font-extralight">
          Splend<span className="font-semibold">Event</span>
        </h1>
        <div className="flex gap-2">
          {navLinks.map((link) => (
            <NavLink key={link.label} label={link.label} href={link.href} />
          ))}
        </div>
      </div>
    </nav>
  );
}
