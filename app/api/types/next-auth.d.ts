import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {

  interface Session {
    user: {
      id: string
      role: string
      mobile: string
    } & DefaultSession["user"]
  }

  interface User {
    role: string
  }
}

declare module "next-auth/jwt" {

  interface JWT {
    id: string
    role: string
  }
}