import NextAuth, { DefaultSession } from "next-auth"
import "next-auth/jwt" // Mandatory for JWT module augmentation to work properly

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id?: string
      role?: string
      mobile?: string
    } & DefaultSession["user"]
  }

  /**
   * The shape of the user object returned in the OAuth providers, database, or authorize callback
   */
  interface User {
    role: string
    mobile?: string
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken` when using JWT sessions */
  interface JWT {
    id?: string
    role?: string
    mobile?: string
    lastActivity?: number
  }
}
