"use client";

import { useEffect }   from "react";
import { useQuery }    from "@tanstack/react-query";
import { usePathname } from "next/navigation";

import { authService }  from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { QUERY_KEYS }   from "@/constants/query-keys";


// Auth pages — never attempt session restore here
const AUTH_ROUTES = new Set(["/login", "/register"]);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setUser, clearUser, setLoading } = useAuthStore();

  const isAuthPage  = AUTH_ROUTES.has(pathname);
const shouldFetch = !isAuthPage;

  const { data, isSuccess, isError, isPending } = useQuery({
    queryKey: QUERY_KEYS.AUTH.ME,
    queryFn:  authService.getMe,
    enabled:  shouldFetch,
    retry:    false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // ✅ ALL state mutations go inside useEffect — never during render
  useEffect(() => {
    // Not fetching at all (auth page or no token)
    if (!shouldFetch) {
      setLoading(false);
      return;
    }

    // Query is running — show loading
    if (isPending) {
      setLoading(true);
      return;
    }

    // Query succeeded
    if (isSuccess && data) {
      setUser(data);
      setLoading(false);
      return;
    }

    // Query failed — clear session
    if (isError) {
      clearUser();
      setLoading(false);
    }
  }, [
    shouldFetch,
    isPending,
    isSuccess,
    isError,
    data,
    setUser,
    clearUser,
    setLoading,
  ]);

  return <>{children}</>;
}