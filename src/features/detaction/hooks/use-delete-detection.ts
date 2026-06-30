import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { QUERY_KEYS } from "@/constants/query-keys";
import { detectionService } from "@/services/detection.service";

export function useDeleteDetection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-detection"],

    mutationFn: (id: string) =>
      detectionService.deleteDetection(id),

    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.DETECTIONS.DETAIL(id),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DETECTIONS.ALL,
      });

      toast.success(
        "Detection deleted successfully"
      );
    },

    onError: () => {
      toast.error(
        "Failed to delete detection. Please try again."
      );
    },
  });
}