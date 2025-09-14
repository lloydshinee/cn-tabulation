// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    fullName: string;
    role: string;
    imageSrc: string;
  }

  interface Session {
    user: User;
  }
}
