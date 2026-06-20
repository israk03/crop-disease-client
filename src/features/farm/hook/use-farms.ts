import { useQuery } from "@tanstack/react-query";
import { farmService } from "@/services/farm.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useMyFarms() {
  return useQuery({
    queryKey: QUERY_KEYS.FARMS.LIST(),
    queryFn: farmService.getMyFarms,
    staleTime: 60_000,
  });
}