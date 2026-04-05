import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
    };
  }
  interface User {
    role: Role;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Wachtwoord", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isValid = await compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnPortal = nextUrl.pathname.startsWith("/portal");
      const isOnCheckin = nextUrl.pathname.startsWith("/checkin");
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      // Checkin page is public (QR code access)
      if (isOnCheckin) return true;

      // Redirect logged-in users away from login
      if (isOnLogin && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // Protect dashboard routes
      if (isOnDashboard) {
        if (!isLoggedIn) return false;
        // Only admin and employee can access dashboard
        if (
          auth?.user?.role !== "ADMIN" &&
          auth?.user?.role !== "EMPLOYEE"
        ) {
          return Response.redirect(new URL("/portal", nextUrl));
        }
        return true;
      }

      // Protect portal routes
      if (isOnPortal) {
        if (!isLoggedIn) return false;
        return true;
      }

      return true;
    },
  },
});
