import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        if (!credentials?.username || !credentials?.password) return null;
        // Call your Express backend API
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            username: credentials.username,
            password: credentials.password,
          }
        );
        const user = response.data;
        if (!user) return null;
        console.log(user);
        return {
          id: user.id,
          username: user.username,
          role: user.role,
          fullName: user.fullName,
          imageSrc: user.imageSrc,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.fullName = user.fullName;
        token.imageSrc = user.imageSrc;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.role = token.role as string;
      session.user.fullName = token.fullName as string;
      session.user.imageSrc = token.imageSrc as string;
      return session;
    },
  },
});
