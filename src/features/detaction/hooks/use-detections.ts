import { useQuery } from "@tanstack/react-query";
import { detectionService } from "@/services/detection.service";
import { QUERY_KEYS } from "@/constants/query-keys";
import { DetectionStatus } from "@/types/api.types";

interface UseDetectionsParams {
  status?: DetectionStatus;
  page?: number;
  limit?: number;
}

export function useMyDetections(params: UseDetectionsParams = {}) {
  const query = useQuery({
    queryKey: QUERY_KEYS.DETECTIONS.LIST(params),
    queryFn: () => detectionService.getMyDetections(params),

    staleTime: 30_000,

    // keeps UI stable during pagination transitions
    placeholderData: (prev) => prev,

    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  return {
    ...query,

    // normalized UI layer
    detections: query.data?.detections ?? [],
    meta: query.data?.meta ?? null,
  };
}