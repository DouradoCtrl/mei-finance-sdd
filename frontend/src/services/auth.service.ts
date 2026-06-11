import { apiFetch } from '@/lib/api';

export async function login(email: string, password: string) {
  return await apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function register(userData: {
  name: string;
  email: string;
  password?: string;
  cnpj?: string | null;
}) {
  return await apiFetch('/auth/register', {
    method: 'POST',
    body: userData,
  });
}


export async function logout(accessToken: string) {
  return await apiFetch('/logout', {
    method: 'POST',
    accessToken,
  });
}

export async function getUser(accessToken: string) {
  return await apiFetch('/user', {
    method: 'GET',
    accessToken,
  });
}
