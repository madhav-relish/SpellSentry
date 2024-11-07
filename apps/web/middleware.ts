import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Check if the request is for the root path
    if (req.nextUrl.pathname === '/') {
      // Redirect to /dashboard
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Allow other requests to proceed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // Allow access to all routes
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/scan-website/:path*",
    "/api/websites/:path*",
    "/:path*", // Match all paths to handle the root redirection
  ],
}; 