import { NextResponse } from "next/server"

export function middleware(request) {
  // For development, allow all routes
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

