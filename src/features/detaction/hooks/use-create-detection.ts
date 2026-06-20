import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { api } from "@/lib/axios";
import { QUERY_KEYS } from "@/constants/query-keys";
import type {
  ApiResponse,
  Detection,
} from "@/types/api.types";

export interface CreateDetectionPayload {
  cropType: string;
  farmId?: string;
  cropId?: string;
  image: File;
}

interface ErrorResponse {
  message: string;
}

const createDetection = async (
  payload: CreateDetectionPayload
): Promise<Detection> => {
  const formData = new FormData();

  formData.append("cropImage", payload.image);

  formData.append(
    "cropType",
    payload.cropType
  );

  if (payload.farmId) {
    formData.append(
      "farmId",
      payload.farmId
    );
  }

  if (payload.cropId) {
    formData.append(
      "cropId",
      payload.cropId
    );
  }

  const { data } = await api.post<
    ApiResponse<{
      detection: Detection;
    }>
  >(
    "/detections",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  if (!data.data?.detection) {
    throw new Error(
      "Detection creation failed"
    );
  }

  return data.data.detection;
};

export function useCreateDetection() {
  const queryClient =
    useQueryClient();

  const mutation = useMutation({
    mutationFn: createDetection,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          QUERY_KEYS.DETECTIONS.ALL,
      });

      toast.success(
        "Image uploaded successfully. AI analysis has started."
      );
    },

    onError: (
      error: AxiosError<ErrorResponse>
    ) => {
      const message =
        error.response?.data?.message ??
        "Failed to upload image";

      toast.error(message);
    },
  });

  return {
    ...mutation,

    createDetection:
      mutation.mutate,

    createDetectionAsync:
      mutation.mutateAsync,
  };
}