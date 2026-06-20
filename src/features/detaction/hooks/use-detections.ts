import { useQuery } from "@tanstack/react-query";
import { detectionService } from "@/services/detection.service";
import { QUERY_KEYS } from "@/constants/query-keys";
import { DetectionStatus } from "@/types/api.types";

interface UseDetectionsParams {
  status?: DetectionStatus;
  page?: number;
  limit?: number;
}

export function useMyDetections(
  params: UseDetectionsParams = {}
) {
  const query = useQuery({
    queryKey: QUERY_KEYS.DETECTIONS.LIST(params),

    queryFn: () =>
      detectionService.getMyDetections(params),

    staleTime: 30_000,

    // 🔥 prevents UI flicker during pagination
    placeholderData: (prev) => prev,

    // 🔥 safer refetch behavior
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  return {
    ...query,

    // 🔥 normalized data shape for UI consistency
    detections: query.data?.detections ?? [],
    meta: query.data?.meta,
  };
}