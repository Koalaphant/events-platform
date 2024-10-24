import { Nav, NavLink } from "@/components/Nav";
import Footer from "./_components/footer";

export const dynamic = "force-dynamic";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/events">Events</NavLink>
        <NavLink href="/orders">Orders</NavLink>
      </Nav>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
