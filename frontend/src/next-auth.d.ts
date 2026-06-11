import { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id: string;
    name: string;
    email: string;
    cnpj?: string | null;
    accessToken: string;
    successMessage?: string;
  }

  interface Session extends DefaultSession {
    accessToken: string;
    successMessage?: string;
    user: {
      id: string;
      name: string;
      email: string;
      cnpj?: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    successMessage?: string;
    user: {
      id: string;
      name: string;
      email: string;
      cnpj?: string | null;
    };
  }
}
