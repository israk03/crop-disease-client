import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { AxiosError } from "axios";
import { toast } from "sonner";

import {
  farmService,
  CreateCropPayload,
  UpdateCropPayload,
} from "@/services/farm.service";

import { QUERY_KEYS } from "@/constants/query-keys";

export function useCrops(
  farmId: string
) {
  const query = useQuery({
    queryKey:
      QUERY_KEYS.FARMS.CROPS(
        farmId
      ),

    queryFn: () =>
      farmService.getCropsForFarm(
        farmId
      ),

    enabled: Boolean(farmId),

    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    crops: query.data ?? [],
  };
}

export function useAddCrop(
  farmId: string
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateCropPayload
    ) =>
      farmService.addCrop(
        farmId,
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          QUERY_KEYS.FARMS.CROPS(
            farmId
          ),
      });

      toast.success(
        "Crop added successfully"
      );
    },

    onError: (error) => {
      const axiosError =
        error as AxiosError<{
          message?: string;
        }>;

      toast.error(
        axiosError.response?.data
          ?.message ??
          "Failed to add crop"
      );
    },
  });
}

export function useUpdateCrop(
  farmId: string,
  cropId: string
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: UpdateCropPayload
    ) =>
      farmService.updateCrop(
        farmId,
        cropId,
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          QUERY_KEYS.FARMS.CROPS(
            farmId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          QUERY_KEYS.FARMS.CROP(
            farmId,
            cropId
          ),
      });

      toast.success(
        "Crop updated successfully"
      );
    },

    onError: (error) => {
      const axiosError =
        error as AxiosError<{
          message?: string;
        }>;

      toast.error(
        axiosError.response?.data
          ?.message ??
          "Failed to update crop"
      );
    },
  });
}

export function useDeleteCrop(
  farmId: string
) {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      cropId: string
    ) =>
      farmService.deleteCrop(
        farmId,
        cropId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          QUERY_KEYS.FARMS.CROPS(
            farmId
          ),
      });

      toast.success(
        "Crop removed successfully"
      );
    },

    onError: () => {
      toast.error(
        "Failed to remove crop. Please try again."
      );
    },
  });
}