import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/constants/query-keys";
import { detectionService } from "@/services/detection.service";

export function useToggleSharing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["toggle-detection-sharing"],

    mutationFn: (id: string) =>
      detectionService.toggleSharing(id),

    onSuccess: (updated) => {
      queryClient.setQueryData(
        QUERY_KEYS.DETECTIONS.DETAIL(updated._id),
        updated
      );

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DETECTIONS.ALL,
      });

      toast.success(
        updated.isShared
          ? "Detection shared with the community"
          : "Detection removed from the community"
      );
    },

    onError: () => {
      toast.error(
        "Failed to update sharing status."
      );
    },
  });
}