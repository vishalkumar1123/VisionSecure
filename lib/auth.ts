import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import { connectDB } from "@/lib/mongodb"
import User from "@/models/User"

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
          console.log("========== LOGIN DEBUG ==========")
          console.log("EMAIL:", email)
          console.log("USER:", user)
          console.log("================================")
          console.log(
            "LOGIN EMAIL:",
            email
          )

          console.log(
            "USER FOUND:",
            user?.email
          )

          if (!user) {
            console.log("User not found")
            return null
          }

          if (!user.isActive) {
            console.log(
              "Account disabled"
            )
            return null
          }         

          const isPasswordCorrect =
            await bcrypt.compare(
              credentials.password,
              user.password
            )

          console.log(
            "PASSWORD MATCH:",
            isPasswordCorrect
          )

          if (!isPasswordCorrect) {
            return null
          }

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
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = String(user.id)
        token.role = String(user.role)
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

  pages: {
    signIn: "/admin/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: true,
}