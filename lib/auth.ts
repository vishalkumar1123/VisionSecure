import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { timingSafeEqual } from "crypto"

import { connectDB } from "@/lib/mongodb"
import { ActivityLogService } from "@/services/activity-log-service"
import User from "@/models/User"
import { ADMIN_IDLE_TIMEOUT_MS } from "@/lib/session-security"

const BCRYPT_HASH = /^\$2[aby]\$\d{2}\$/

function matchesLegacyPassword(candidate: string, stored: string) {
  const candidateBuffer = Buffer.from(candidate)
  const storedBuffer = Buffer.from(stored)
  return candidateBuffer.length === storedBuffer.length && timingSafeEqual(candidateBuffer, storedBuffer)
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        try {
          await connectDB()

          if (
            !credentials?.email ||
            !credentials?.password
          ) {
            throw new Error(
              "Email and password required"
            )
          }

          const email = credentials.email
            .toLowerCase()
            .trim()

          const user = await User.findOne({
            email,
          }).select("+password")
          if (!user) {
            const { failedLoginEmail } = await import("@/lib/email-config/security-event")
            await failedLoginEmail(email).catch(() => undefined)
            return null
          }

          if (!user.isActive) {
            const { failedLoginEmail } = await import("@/lib/email-config/security-event")
            await failedLoginEmail(email).catch(() => undefined)
            return null
          }

          const isBcryptPassword = BCRYPT_HASH.test(user.password)
          const isPasswordCorrect = isBcryptPassword
            ? await bcrypt.compare(credentials.password, user.password)
            : matchesLegacyPassword(credentials.password, user.password)

          if (!isPasswordCorrect) {
            const { failedLoginEmail } = await import("@/lib/email-config/security-event")
            await failedLoginEmail(String(user._id)).catch(() => undefined)
            return null
          }

          // Older records in this project stored passwords without bcrypt.
          // Upgrade a verified legacy credential immediately and never expose
          // or retain the plain-text value after a successful login.
          if (!isBcryptPassword) {
            user.password = await bcrypt.hash(credentials.password, 12)
          }

          user.lastLoginAt = new Date()
          await user.save()

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          }
        } catch (error) {
          console.error(
            "AUTH ERROR:",
            error
          )

          return null
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (!user && (typeof token.exp !== "number" || token.exp * 1000 <= Date.now())) {
        return {}
      }

      if (user) {
        token.id = String(user.id)
        token.role = String(user.role)
        token.lastActivity = Date.now()
      } else if (trigger === "update") {
        token.lastActivity = Date.now()
      } else if (typeof token.lastActivity !== "number" || Date.now() - token.lastActivity >= ADMIN_IDLE_TIMEOUT_MS) {
        return {}
      }

      if (!user) {
        try {
          await connectDB()
          const currentUser = await User.findById(String(token.id || token.sub)).select("role isActive").lean()
          if (!currentUser?.isActive) return {}
          token.role = String(currentUser.role)
        } catch { return {} }
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id =
          token.id

        ;(session.user as any).role =
          token.role
      }

      return session
    },
  },

  events: {
    async signIn({ user }) {
      await ActivityLogService.log({ userId: user.id, action: "LOGIN" })
    },
    async signOut(message) {
      if ("token" in message && message.token?.sub) {
        await ActivityLogService.log({ userId: message.token.sub, action: "LOGOUT" })
      }
    },
  },

  pages: {
    signIn: "/admin/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: false,
}
