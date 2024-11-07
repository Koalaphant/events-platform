import { Nav, NavLink } from "@/components/Nav";
import { auth } from "@clerk/nextjs/server";
import Footer from "../(customer)/_components/footer";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (userId !== null) redirect("/");

  return (
    <div className="flex flex-col min-h-screen">
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/events">Events</NavLink>
      </Nav>
      <main className="flex flex-grow items-center justify-center">
        {children}
      </main>
      <Footer />
    </div>
  );
}
