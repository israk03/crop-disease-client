import { useQuery } from "@tanstack/react-query";

import { weatherService } from "@/services/weather.service";
import { QUERY_KEYS } from "@/constants/query-keys";

export function useWeatherForFarm(
  farmId?: string
) {
  const query = useQuery({
    queryKey: QUERY_KEYS.WEATHER.FARM(
      farmId ?? ""
    ),

    queryFn: () =>
      weatherService.getWeatherForFarm(
        farmId!
      ),

    enabled: !!farmId,

    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes

    retry: 1,

    refetchOnWindowFocus: false,
  });

  return {
    ...query,

    weather: query.data ?? null,
  };
}