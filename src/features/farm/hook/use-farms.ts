import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import {
  farmService,
  CreateFarmPayload,
  UpdateFarmPayload,
} from "@/services/farm.service";

import { QUERY_KEYS } from "@/constants/query-keys";

export function useMyFarms() {
  const query = useQuery({
    queryKey: QUERY_KEYS.FARMS.LIST(),
    queryFn: farmService.getMyFarms,

    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    farms: query.data ?? [],
  };
}

export function useFarm(farmId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.FARMS.DETAIL(farmId),

    queryFn: () =>
      farmService.getFarmById(farmId),

    enabled: Boolean(farmId),

    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export function useCreateFarm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateFarmPayload
    ) => farmService.createFarm(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FARMS.ALL,
      });

      toast.success(
        "Farm created successfully"
      );
    },

    onError: (error) => {
      const axiosError =
        error as AxiosError<{
          message?: string;
        }>;

      toast.error(
        axiosError.response?.data?.message ??
          "Failed to create farm"
      );
    },
  });
}

export function useUpdateFarm(
  farmId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: UpdateFarmPayload
    ) =>
      farmService.updateFarm(
        farmId,
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FARMS.ALL,
      });

      queryClient.invalidateQueries({
        queryKey:
          QUERY_KEYS.FARMS.DETAIL(
            farmId
          ),
      });

      toast.success(
        "Farm updated successfully"
      );
    },

    onError: (error) => {
      const axiosError =
        error as AxiosError<{
          message?: string;
        }>;

      toast.error(
        axiosError.response?.data?.message ??
          "Failed to update farm"
      );
    },
  });
}

export function useDeleteFarm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (farmId: string) =>
      farmService.deleteFarm(farmId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FARMS.ALL,
      });

      toast.success(
        "Farm deleted successfully"
      );
    },

    onError: () => {
      toast.error(
        "Failed to delete farm. Please try again."
      );
    },
  });
}