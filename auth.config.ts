import type { NextAuthConfig } from "next-auth";

// Telegram Desktop and web.telegram.org open the app in a cross-site iframe,
// where browsers drop SameSite=Lax cookies (sign-in then fails on CSRF and the
// session never sticks). SameSite=None requires Secure; Partitioned (CHIPS)
// keeps the cookies working where third-party cookies are blocked.
const crossSiteCookie = {
  options: { sameSite: "none", secure: true, partitioned: true },
} as const;

export const authConfig = {
  // Only options are overridden; NextAuth keeps its default cookie names.
  cookies: {
    sessionToken: crossSiteCookie,
    csrfToken: crossSiteCookie,
    callbackUrl: crossSiteCookie,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnBookings = nextUrl.pathname.startsWith("/bookings");
      if (isOnBookings) {
        return isLoggedIn;
      }
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
