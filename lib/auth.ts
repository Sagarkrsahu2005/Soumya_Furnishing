import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"

// Simple hash function for demo - use bcrypt in production
function hashPassword(password: string): string {
  // Using Buffer.from for compatibility
  return Buffer.from(password).toString('base64')
}

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const admin = await (prisma as any).admin.findUnique({
          where: { email: credentials.email as string }
        })

        if (!admin) {
          return null
        }

        // For now, direct comparison - should use bcrypt in production
        const isValid = admin.password === hashPassword(credentials.password as string)
        
        if (!isValid) {
          return null
        }

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    })
  ],
  pages: {
    signIn: "/admin/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "soumya-furnishings-secret-key-change-in-production"
})
