import { useQuery } from "@tanstack/react-query";
import { alertService } from "@/services/alert.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useMyRegionAlerts() {
  const query = useQuery({
    queryKey: QUERY_KEYS.ALERTS.MY_REGION,
    queryFn: alertService.getMyRegionAlerts,

    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes

    refetchOnWindowFocus: false,
    retry: 1,
  });

  return {
    ...query,
    alerts: query.data ?? [],
  };
}