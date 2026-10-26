import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin && !isLogin && !request.auth) {
    return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
  }

  if (isLogin && request.auth) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
