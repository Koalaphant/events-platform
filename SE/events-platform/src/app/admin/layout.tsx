import { Nav, NavLink } from "@/components/Nav";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/events">Events</NavLink>
        <NavLink href="/admin/users">Customers</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
      </Nav>
      <div className="m-4">
        <div className="mt-10 max-w-7xl mx-auto my-auto">{children}</div>
      </div>
    </>
  );
}
