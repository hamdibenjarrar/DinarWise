const fs = require("fs")
const path = require("path")

// Path to middleware file
const middlewarePath = path.join(__dirname, "..", "middleware.js")

// Check if middleware file exists
if (fs.existsSync(middlewarePath)) {
  console.log("Removing middleware.js file before build...")

  // Create a backup
  fs.copyFileSync(middlewarePath, `${middlewarePath}.bak`)

  // Create an empty middleware file
  fs.writeFileSync(
    middlewarePath,
    `
// Empty middleware file to avoid deployment issues
export function middleware() {
  return Response.next();
}

export const config = {
  matcher: [], // Match no paths
}
  `,
  )

  console.log("Created safe middleware.js file")
}
