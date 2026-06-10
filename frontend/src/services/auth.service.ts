import { apiFetch } from '../lib/api';

export const authService = {
  async register(name: string, email: string, password: string, cnpj?: string) {
    return apiFetch('/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        cnpj: cnpj || null,
      }),
    });
  },

  async login(email: string, password: string) {
    return apiFetch('/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    });
  },

  async logout() {
    return apiFetch('/logout', {
      method: 'POST',
    });
  },

  async getUser() {
    return apiFetch('/user', {
      method: 'GET',
    });
  }
};
