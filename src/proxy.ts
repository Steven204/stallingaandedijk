import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // Checkin page is always public (QR code access)
  if (request.nextUrl.pathname.startsWith("/checkin")) {
    return NextResponse.next();
  }

  // For now, let NextAuth handle auth via its API route
  // Additional route protection can be added here
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/portal/:path*", "/login"],
};
