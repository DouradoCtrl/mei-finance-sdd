import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais ausentes.");
        }

        const laravelBaseUrl = process.env.LARAVEL_API_URL || "http://localhost:8000";

        try {
          const response = await fetch(`${laravelBaseUrl}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const data = await response.json();

          if (response.ok && data.success && data.data) {
            const { token, user } = data.data;
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
              crc: user.crc,
              office_name: user.office_name,
              accessToken: token,
            };
          }

          // Pass the API message if available
          throw new Error(data.message || "Credenciais inválidas.");
        } catch (error: any) {
          console.error("NextAuth authorize error:", error);
          throw new Error(error.message || "Erro de conexão com o servidor.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.crc = user.crc;
        token.office_name = user.office_name;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.crc = token.crc;
        session.user.office_name = token.office_name;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
