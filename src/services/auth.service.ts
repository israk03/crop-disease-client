import { api } from "@/lib/axios";
import type { ApiResponse, User } from "@/types/api.types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "FARMER" | "EXPERT";
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

const login = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  console.log("LOGIN REQUEST");

  const response = await api.post<
    ApiResponse<AuthResponse>
  >("/auth/login", payload);

  console.log("LOGIN RESPONSE");
  console.log(response.data);

  if (!response.data.data) {
    throw new Error("Login failed");
  }

  return response.data.data;
};

const register = async (
  payload: RegisterPayload
): Promise<AuthResponse> => {
  const response =
    await api.post<ApiResponse<AuthResponse>>(
      "/auth/register",
      payload
    );

  if (!response.data.data) {
    throw new Error("Registration failed");
  }

  return response.data.data;
};

const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

const getMe = async (): Promise<User> => {
  const response = await api.get<
    ApiResponse<{ user: User }>
  >("/auth/me");

  if (!response.data.data?.user) {
    throw new Error("Failed to fetch user");
  }

  return response.data.data.user;
};

const refreshToken = async (): Promise<{
  accessToken: string;
}> => {
  const response = await api.post<
    ApiResponse<{
      accessToken: string;
    }>
  >("/auth/refresh-token");

  if (!response.data.data) {
    throw new Error("Token refresh failed");
  }

  return response.data.data;
};

export const authService = {
  login,
  register,
  logout,
  getMe,
  refreshToken,
};