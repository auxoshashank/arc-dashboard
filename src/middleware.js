import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    // Match all routes except public ones
    "/((?!_next/static|_next/image|favicon.ico|login|api/auth).*)",
  ],
};
