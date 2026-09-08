import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "./lib/auth/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const { pathname } = request.nextUrl;

  // Protect /author routes (Authors and Admins only)
  if (pathname.startsWith("/author")) {
    if (
      !session ||
      (session.user.role !== "AUTHOR" && session.user.role !== "ADMIN")
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect /admin routes (Admins only)
  if (pathname.startsWith("/admin")) {
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/author/:path*", "/admin/:path*"],
};
