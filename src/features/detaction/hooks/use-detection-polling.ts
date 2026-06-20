import { useQuery } from "@tanstack/react-query";

import { detectionService } from "@/services/detection.service";
import { QUERY_KEYS } from "@/constants/query-keys";
import { appConfig } from "@/config/app.config";

import type { DetectionStatus } from "@/types/api.types";

const TERMINAL_STATUSES = new Set<DetectionStatus>([
  "COMPLETED",
  "FAILED",
]);

export function useDetectionPolling(
  detectionId: string | null
) {
  return useQuery({
    queryKey: QUERY_KEYS.DETECTIONS.DETAIL(
      detectionId ?? ""
    ),

    queryFn: async () => {
      if (!detectionId) {
        throw new Error(
          "Detection ID is required"
        );
      }

      return detectionService.getDetectionById(
        detectionId
      );
    },

    enabled: Boolean(detectionId),

    staleTime: 0,

    refetchInterval: (query) => {
      // stop polling on error
      if (query.state.error) {
        return false;
      }

      const status = query.state.data?.status;

      // stop polling when analysis finishes
      if (
        status &&
        TERMINAL_STATUSES.has(status)
      ) {
        return false;
      }

      return appConfig.detection.pollIntervalMs;
    },

    refetchOnWindowFocus: false,

    placeholderData: (previousData) =>
      previousData,
  });
}