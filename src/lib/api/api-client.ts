import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

export type ApiResponse<T> = {
  success?: boolean;
  statusCode?: number;
  message?: string | string[];
  data?: T | null;
  timestamp?: string;
  path?: string;
};

type ApiErrorResponse = {
  statusCode?: number;
  message?: string | string[];
  error?: string | { message?: string; details?: string[] };
};

const DEFAULT_API_BASE_URL = "https://uat-api-mems.moc.gov.kh/api/v1";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export class ApiClientError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
  }
}

export const apiRequest = async <T>(config: AxiosRequestConfig) => {
  try {
    const response = await apiClient.request<ApiResponse<T>>(config);
    return (response.data.data ?? response.data) as T;
  } catch (error) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      throw new ApiClientError(
        getErrorMessage(error),
        error.response?.status ?? error.response?.data?.statusCode,
      );
    }

    throw error;
  }
};

export const apiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong",
) => {
  if (error instanceof Error) return error.message || fallback;
  if (typeof error === "string") return error;
  return fallback;
};

const getErrorMessage = (error: AxiosError<ApiErrorResponse>) => {
  const payload = error.response?.data;
  const message = payload?.message;
  const nestedMessage =
    typeof payload?.error === "object" ? payload.error.message : payload?.error;

  if (Array.isArray(message)) return message.join(", ");
  if (message) return message;
  if (nestedMessage) return nestedMessage;

  return error.message || "Something went wrong. Please try again.";
};
