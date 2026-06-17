import { NextRequest, NextResponse } from "next/server";

// Public routes (no auth required)
const PUBLIC_ROUTES = new Set(["/", "/login", "/register"]);

// Public but accessible with or without auth
const PUBLIC_BROWSABLE = ["/experts", "/community", "/search"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isAuthenticated = Boolean(refreshToken);


  const isPublicRoute = PUBLIC_ROUTES.has(pathname);

  const isPublicBrowsable = PUBLIC_BROWSABLE.some((route) =>
    pathname.startsWith(route)
  );

 

  // ── 1. Block unauthenticated access to protected routes ──
  if (!isAuthenticated && !isPublicRoute && !isPublicBrowsable) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // ── 2. Redirect logged-in users away from auth pages ──
  if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
    const redirectPath = "/dashboard";

    return NextResponse.redirect(new URL(redirectPath, request.url));
  }


  return NextResponse.next();
}

// ── Matcher (important optimization) ──
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};