"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";

export function Nav({ children }: { children: ReactNode }) {
  return (
    <nav className="bg-primary w-full">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-4">
        <div className="py-4 md:py-0">
          <Link href="/">
            <h1 className="text-2xl text-white">
              Splend<span className="font-extrabold">Event</span>
            </h1>
          </Link>
        </div>
        <div className="flex  text-white">{children}</div>
      </div>
    </nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
        pathname === props.href && "bg-background text-foreground"
      )}
    />
  );
}
