import { Nav, NavLink } from "@/components/Nav";
import Footer from "./_components/footer";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { sessionClaims } = await auth();
  const userRole = sessionClaims?.metadata?.role;

  return (
    <div className="flex flex-col min-h-screen">
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/events">Events</NavLink>
        <SignedIn>
          <NavLink href="/orders">Orders</NavLink>
          {userRole === "admin" && <NavLink href="/admin">Admin</NavLink>}
          <UserButton
            appearance={{
              elements: {
                rootBox: "my-3 rounded-full ml-3",
              },
            }}
          />
        </SignedIn>
        <SignedOut>
          <NavLink href="/sign-in">Sign In</NavLink>
        </SignedOut>
      </Nav>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
