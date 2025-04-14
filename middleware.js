// Empty middleware file to avoid deployment issues
export function middleware() {
  // Do nothing
  return Response.next()
}

export const config = {
  matcher: [], // Match no paths
}
