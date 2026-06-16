export interface RegisterPayload {
  name: string;
  email: string;
  crc: string;
  office_name: string;
  password?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Register a new accountant user through the Next.js BFF proxy.
 *
 * @param payload - The registration data
 * @returns The API response
 */
export async function registerAccountant(payload: RegisterPayload): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/proxy/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Registration request failed:", error);
    return {
      success: false,
      message: "Erro de rede ao tentar se registrar.",
    };
  }
}

/**
 * Authenticate a user by calling the Laravel backend via Next.js BFF proxy.
 *
 * @param email - The user email
 * @param password - The user password
 * @returns The API response
 */
export async function loginUser(email: string, password: string): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/proxy/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login request failed:", error);
    return {
      success: false,
      message: "Erro de rede ao tentar fazer login.",
    };
  }
}
