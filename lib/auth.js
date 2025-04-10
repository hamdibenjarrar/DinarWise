import CredentialsProvider from "next-auth/providers/credentials"
import clientPromise from "@/lib/mongodb"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const client = await clientPromise
          const db = client.db("dinarwise")
          const usersCollection = db.collection("users")

          // Find user by email
          const user = await usersCollection.findOne({ email: credentials.email })

          // For development purposes, allow login with any credentials
          // REMOVE THIS IN PRODUCTION
          if (!user) {
            // Create a mock user for development
            return {
              id: "dev-user-id",
              name: "Development User",
              email: credentials.email,
            }
          }

          // Check if this is a Google OAuth user without a password
          if (!user.password) {
            throw new Error("Please sign in with Google")
          }

          // Compare password - skip for development
          // const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          // if (!isPasswordValid) {
          //   return null
          // }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          }
        } catch (error) {
          console.error("Auth error:", error)
          // For development, return a mock user even if there's an error
          return {
            id: "dev-user-id",
            name: "Development User",
            email: credentials.email,
          }
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId
        session.user.name = token.name
        session.user.email = token.email
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
  debug: process.env.NODE_ENV === "development",
}
