import { User, UserFormPayload } from "../types";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * List and paginate users with optional search filter.
 *
 * @param search - Optional query string for search by name/email
 * @param page - Optional page number
 * @returns The API response with paginated users
 */
export async function listUsers(search?: string, page?: number): Promise<ApiResponse> {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (page) params.append("page", String(page));

    const response = await fetch(`/api/proxy/users?${params.toString()}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("List users request failed:", error);
    return {
      success: false,
      message: "Erro de rede ao carregar a lista de usuários.",
    };
  }
}

/**
 * Create a new user (admin or accountant).
 *
 * @param payload - The user details
 * @returns The API response
 */
export async function createUser(payload: UserFormPayload): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/proxy/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Create user request failed:", error);
    return {
      success: false,
      message: "Erro de rede ao tentar criar o usuário.",
    };
  }
}

/**
 * Update user details.
 *
 * @param id - User ID
 * @param payload - The updated user details
 * @returns The API response
 */
export async function updateUser(id: number, payload: UserFormPayload): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/proxy/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update user request failed:", error);
    return {
      success: false,
      message: "Erro de rede ao tentar atualizar o usuário.",
    };
  }
}

/**
 * Delete a user record.
 *
 * @param id - User ID
 * @returns The API response
 */
export async function deleteUser(id: number): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/proxy/users/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Delete user request failed:", error);
    return {
      success: false,
      message: "Erro de rede ao tentar excluir o usuário.",
    };
  }
}
