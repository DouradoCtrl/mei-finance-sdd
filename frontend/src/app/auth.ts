import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { login } from '@/services/auth.service';
import { ApiError } from '@/lib/api';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'MEI Finance API',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await login(
            credentials?.email || '',
            credentials?.password || ''
          );

          if (!response.success) {
            throw new Error(response.message || 'Ocorreu um erro desconhecido.');
          }

          if (response.success && response.data) {
            return {
              id: String(response.data.usuario.id),
              name: response.data.usuario.name,
              email: response.data.usuario.email,
              cnpj: response.data.usuario.cnpj,
              accessToken: response.data.token,
              successMessage: response.message,
            };
          }

          return null;
        } catch (error) {
          if (error instanceof ApiError) {
            throw new Error(error.response.message || 'Erro de comunicação com o servidor.');
          }
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error('Não foi possível realizar o login. Tente novamente.');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name || '',
          email: user.email || '',
          cnpj: (user as any).cnpj || null,
        };
        token.accessToken = (user as any).accessToken;
        token.successMessage = (user as any).successMessage;
      }
      if (trigger === 'update' && session?.user) {
        token.user = {
          ...(token.user as any),
          ...session.user,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user = token.user as any;
        (session as any).accessToken = token.accessToken;
        (session as any).successMessage = token.successMessage;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
