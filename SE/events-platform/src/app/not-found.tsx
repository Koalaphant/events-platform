import { Nav, NavLink } from "@/components/Nav";
import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/events">Events</NavLink>
        <NavLink href="/orders">Orders</NavLink>
      </Nav>
      <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link className="text-2xl font-extrabold" href="/">
          Go back to the home page
        </Link>
      </div>
    </div>
  );
}
