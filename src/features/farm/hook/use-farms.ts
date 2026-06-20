import { useQuery } from "@tanstack/react-query";
import { farmService } from "@/services/farm.service";
import { QUERY_KEYS } from "@/constants/query-keys";

interface UseFarmsParams {
  page?: number;
  limit?: number;
}

export function useMyFarms(params?: UseFarmsParams) {
  return useQuery({
    queryKey: QUERY_KEYS.FARMS.LIST(params),
    queryFn: () => farmService.getMyFarms(),
    staleTime: 60_000,
  });
}