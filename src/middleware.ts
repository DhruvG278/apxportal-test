import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { config as Env } from "@/config/env";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  console.log("token", token);
  // Allow public routes like login
  if (
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/api/zoho/login")
  ) {
    return NextResponse.next();
  }

  if (!token) {
    // No token -> redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify token
    const secret = new TextEncoder().encode(Env.JWT_SECRET as string);
    const decoded = await jwtVerify(token, secret);
    // console.log("decode", decoded);
    // Attach decoded data to request headers (for server routes)
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-email", (decoded.payload as any).email);
    requestHeaders.set("x-school-id", (decoded.payload as any).schoolId);
    requestHeaders.set(
      "x-school",
      JSON.stringify((decoded.payload as any).schoolData)
    );
    const res = NextResponse.next({ request: { headers: requestHeaders } });
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/enquiries", req.url));
    }
    return res;
  } catch (err) {
    console.error("JWT Error:", err);
    // Invalid token -> redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/zoho/public|login|assets/).*)",
  ],
};
