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
      authorized: ({ token }) => {
        // Check if the token is valid
        if (!token) {
          return false; // Redirect to sign-in page if no token
        }
        return true; // Allow access if token is valid
      },
    },
    pages: {
      signIn: "/login", // Redirect to this page if not authorized
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