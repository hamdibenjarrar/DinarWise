import { NextResponse } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  // Simple middleware that doesn't use eval() or new Function()
  const path = request.nextUrl.pathname

  // Redirect /dashboard to / if not authenticated
  // This is just an example - NextAuth handles auth redirects automatically
  // so you may not need this specific logic

  // Return the response without any dynamic code execution
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
