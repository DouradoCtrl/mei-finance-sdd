const API_BASE_URL = 
  (typeof window === 'undefined' ? process.env.NEXT_API_URL : null) || 
  process.env.NEXT_PUBLIC_API_URL || 
  'http://localhost:8000/api';

interface ApiOptions extends RequestInit {
  accessToken?: string;
  body?: any;
  headers?: HeadersInit & {
    Authorization?: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  response: ApiResponse;
  status: number;

  constructor(message: string, response: ApiResponse, status: number) {
    super(message);
    this.name = 'ApiError';
    this.response = response;
    this.status = status;
  }
}

export const apiFetch = async (endpoint: string, options: ApiOptions = {}) => {
  const { accessToken, body, ...restOptions } = options;

  const baseUrl = API_BASE_URL?.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${baseUrl}${cleanEndpoint}`;

  const isFormData = typeof window !== 'undefined' && body instanceof FormData;

  const headers: HeadersInit = {
    'Accept': 'application/json',
    ...restOptions.headers,
  };

  if (!isFormData) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  if (accessToken) {
    (headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
  }

  const config: RequestInit = {
    ...restOptions,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(fullUrl, config);

  if (!response.ok) {
    const errorText = await response.text();
    let errorPayload: ApiResponse;

    try {
      errorPayload = JSON.parse(errorText);
    } catch (e) {
      errorPayload = {
        success: false,
        message: errorText || 'Ocorreu um erro inesperado no servidor.'
      };
    }

    throw new ApiError(
      `API request failed with status ${response.status}: ${errorPayload.message}`,
      errorPayload,
      response.status
    );
  }

  const successText = await response.text();
  if (!successText) {
    return null;
  }

  try {
    return JSON.parse(successText);
  } catch (e) {
    return successText;
  }
};
