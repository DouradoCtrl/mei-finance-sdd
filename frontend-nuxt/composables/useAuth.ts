import { ref, computed } from 'vue'

export interface User {
  id: number
  name: string
  email: string
  cnpj?: string | null
  role: string
  active: boolean
}

export const useAuth = () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/'
  })
  const user = useState<User | null>('auth_user', () => null)
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  const login = async (email: string, password: string) => {
    try {
      const response: any = await $fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        body: { email, password }
      })

      if (response && response.success && response.data) {
        token.value = response.data.token
        user.value = response.data.usuario
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message || 'Credenciais inválidas' }
    } catch (err: any) {
      return { success: false, message: err.data?.message || 'Erro de conexão com o servidor' }
    }
  }

  const register = async (userData: { name: string; email: string; cnpj?: string | null; password?: string }) => {
    try {
      const response: any = await $fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        body: userData
      })

      if (response && response.success && response.data) {
        token.value = response.data.token
        user.value = response.data.usuario
        return { success: true, message: response.message }
      }
      return { success: false, message: response.message || 'Falha ao cadastrar' }
    } catch (err: any) {
      return { success: false, message: err.data?.message || 'Erro de conexão com o servidor' }
    }
  }

  const logout = async () => {
    if (token.value) {
      try {
        await $fetch(`${apiBase}/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.value}`
          }
        })
      } catch (err) {
        console.error('Erro ao efetuar logout no backend:', err)
      }
    }
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  const fetchUser = async () => {
    if (!token.value) return
    try {
      const response: any = await $fetch(`${apiBase}/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      user.value = response
    } catch (err) {
      token.value = null
      user.value = null
    }
  }

  const apiFetch = async (endpoint: string, options: any = {}) => {
    const headers = {
      Accept: 'application/json',
      ...options.headers
    } as any

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    return await $fetch(`${apiBase}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`, {
      ...options,
      headers
    })
  }

  return {
    token,
    user,
    login,
    register,
    logout,
    fetchUser,
    apiFetch,
    isAuthenticated: computed(() => !!token.value)
  }
}
