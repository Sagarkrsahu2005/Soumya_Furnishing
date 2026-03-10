import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

// Simple hash function for demo - use bcrypt in production
function hashPassword(password: string): string {
  // Using Buffer.from for compatibility
  return Buffer.from(password).toString('base64')
}

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // First check if it's an admin
        const admin = await (prisma as any).admin.findUnique({
          where: { email: credentials.email as string }
        })

        if (admin) {
          const isValid = admin.password === hashPassword(credentials.password as string)
          
          if (isValid) {
            return {
              id: admin.id,
              email: admin.email,
              name: admin.name,
              role: admin.role
            }
          }
        }

        // If not admin, check if it's a customer
        const customer = await prisma.customer.findUnique({
          where: { email: credentials.email as string }
        }) as any

        if (customer && customer.password) {
          const isValid = await bcrypt.compare(
            credentials.password as string, 
            customer.password
          )
          
          if (isValid) {
            return {
              id: customer.id,
              email: customer.email,
              name: `${customer.firstName} ${customer.lastName}`,
              firstName: customer.firstName,
              lastName: customer.lastName,
              role: "customer"
            }
          }
        }

        return null
      }
    })
  ],
  pages: {
    signIn: "/auth/login"
  },
  callbacks: {
    async signIn({ user, account, profile }: any) {
      // For Google sign-in, automatically create customer if doesn't exist
      if (account?.provider === "google" && user?.email) {
        try {
          const existingCustomer = await prisma.customer.findUnique({
            where: { email: user.email }
          })

          if (!existingCustomer) {
            // Create new customer from Google profile
            await prisma.customer.create({
              data: {
                email: user.email,
                firstName: profile?.given_name || user.name?.split(' ')[0] || 'User',
                lastName: profile?.family_name || user.name?.split(' ').slice(1).join(' ') || '',
                acceptsMarketing: false,
              }
            })
          }
        } catch (error) {
          console.error('Error creating customer:', error)
        }
      }
      return true
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.role = user.role || 'customer'
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "soumya-furnishings-secret-key-change-in-production"
}

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth(authOptions)
