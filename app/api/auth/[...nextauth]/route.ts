import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const baseUrl = process.env.NEXTAUTH_URL;
        try {
          const res = await fetch(`${baseUrl}/api/user/sign-in`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });
          const user = await res.json();

          // Handle specific HTTP status codes with custom errors
          if (res.status === 404) {
            throw new Error("UserNotFound");
          }
          if (res.status === 401) {
            throw new Error("InvalidPassword");
          }
          if (res.status === 400) {
            throw new Error("InvalidCredentials");
          }

          // If no error and we have user data, return it
          if (res.ok && user) {
            return user.user;
          }

          // Generic error for other cases
          throw new Error("AuthenticationFailed");
        } catch (error) {
          console.error("Error in authorize:", error);
          throw error;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in", // Error code passed in query string as ?error=error
  },
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
