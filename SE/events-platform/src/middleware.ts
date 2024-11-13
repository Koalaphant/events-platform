import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/events(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/webhooks/stripe",
  "/api/seed",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const userRole = sessionClaims?.metadata?.role;

  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAdminRoute(req) && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!.*\\..*|_next).*)", // Routes
    "/", // Always run for the home page
    "/(api|trpc)(.*)", // Always run for API routes
  ],
};
