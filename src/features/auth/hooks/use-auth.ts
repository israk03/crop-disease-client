"use client";

import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  authService,
  type LoginPayload,
  type RegisterPayload,
} from "@/services/auth.service";

import { useAuthStore } from "@/store/auth.store";
import {
  setAccessToken,
  clearAccessToken,
} from "@/lib/axios";

import { ROUTES } from "@/constants/routes";

const ROLE_COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

const setRoleCookie = (role: string) => {
  document.cookie =
    `userRole=${role}; path=/; max-age=${ROLE_COOKIE_MAX_AGE}; SameSite=Lax`;
};

const clearRoleCookie = () => {
  document.cookie =
    "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

const getErrorMessage = (
  error: AxiosError<{ message?: string }>,
  fallback: string
) => {
  return error.response?.data?.message ?? fallback;
};

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    clearUser,
  } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) =>
      authService.login(payload),

    onSuccess: (data) => {
      setAccessToken(data.accessToken);

      setUser(data.user);

      setRoleCookie(data.user.role);

      queryClient.clear();

      toast.success(
        `Welcome back, ${data.user.name}!`
      );

      const redirect =
        data.user.role === "ADMIN"
          ? ROUTES.ADMIN.DASHBOARD
          : data.user.role === "EXPERT"
          ? ROUTES.EXPERT.DASHBOARD
          : ROUTES.FARMER.DASHBOARD;

      router.push(redirect);
    },

    onError: (
      error: AxiosError<{ message?: string }>
    ) => {
      toast.error(
        getErrorMessage(
          error,
          "Invalid email or password"
        )
      );
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) =>
      authService.register(payload),

    onSuccess: (data) => {
      setAccessToken(data.accessToken);

      setUser(data.user);

      setRoleCookie(data.user.role);

      queryClient.clear();

      toast.success(
        `Welcome to AgriSense, ${data.user.name}!`
      );

      const redirect =
        data.user.role === "EXPERT"
          ? ROUTES.EXPERT.DASHBOARD
          : ROUTES.FARMER.DASHBOARD;

      router.push(redirect);
    },

    onError: (
      error: AxiosError<{ message?: string }>
    ) => {
      toast.error(
        getErrorMessage(
          error,
          "Registration failed. Please try again."
        )
      );
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,

    onSuccess: () => {
      clearAccessToken();
      clearUser();

      clearRoleCookie();

      queryClient.clear();

      toast.success(
        "Logged out successfully"
      );

      router.push(ROUTES.LOGIN);
    },

    onError: () => {
      clearAccessToken();
      clearUser();

      clearRoleCookie();

      queryClient.clear();

      router.push(ROUTES.LOGIN);
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading,

    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,

    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}