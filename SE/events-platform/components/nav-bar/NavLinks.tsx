"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  label: string;
  href: string;
}

export default function NavLink({ label, href }: NavLinkProps) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={` ${
        isActive
          ? "text-white font-extrabold underline underline-offset-4"
          : "text-white"
      }`}
    >
      {label}
    </Link>
  );
}
