"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { QUERY_KEYS } from "@/constants/query-keys";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    setUser,
    clearUser,
    setLoading,
  } = useAuthStore();

  const {
    data,
    isSuccess,
    isError,
    isPending,
  } = useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn: authService.getMe,

    retry: false,

    staleTime: Infinity,

    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isPending) {
      setLoading(true);
      return;
    }

    if (isSuccess && data) {
      setUser(data);
      setLoading(false);
      return;
    }

    if (isError) {
      clearUser();
      setLoading(false);
    }
  }, [
    data,
    isSuccess,
    isError,
    isPending,
    setUser,
    clearUser,
    setLoading,
  ]);

  return <>{children}</>;
}