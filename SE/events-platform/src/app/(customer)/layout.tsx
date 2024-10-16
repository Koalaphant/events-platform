import { Nav, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/events">Events</NavLink>
        <NavLink href="/orders">Orders</NavLink>
      </Nav>
      <div className="px-4 sm:mx-6 max-w-screen-lg lg:mx-auto my-6 mt-24">
        {children}
      </div>
    </>
  );
}
