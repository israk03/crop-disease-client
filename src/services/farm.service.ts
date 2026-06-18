import { api } from "@/lib/axios";

import type {
  ApiResponse,
  Farm,
} from "@/types/api.types";

export interface FarmListResponse {
  farms: Farm[];
}

const getMyFarms = async (): Promise<Farm[]> => {
  const response = await api.get<
    ApiResponse<{
      farms: Farm[];
    }>
  >("/farms");

  if (!response.data.data?.farms) {
    throw new Error(
      "Failed to fetch farms"
    );
  }

  return response.data.data.farms;
};

const getFarmById = async (
  farmId: string
): Promise<Farm> => {
  const response = await api.get<
    ApiResponse<{
      farm: Farm;
    }>
  >(`/farms/${farmId}`);

  if (!response.data.data?.farm) {
    throw new Error(
      "Farm not found"
    );
  }

  return response.data.data.farm;
};

const createFarm = async (
  payload: Partial<Farm>
): Promise<Farm> => {
  const response = await api.post<
    ApiResponse<{
      farm: Farm;
    }>
  >("/farms", payload);

  if (!response.data.data?.farm) {
    throw new Error(
      "Failed to create farm"
    );
  }

  return response.data.data.farm;
};

const updateFarm = async (
  farmId: string,
  payload: Partial<Farm>
): Promise<Farm> => {
  const response = await api.patch<
    ApiResponse<{
      farm: Farm;
    }>
  >(`/farms/${farmId}`, payload);

  if (!response.data.data?.farm) {
    throw new Error(
      "Failed to update farm"
    );
  }

  return response.data.data.farm;
};

const deleteFarm = async (
  farmId: string
): Promise<void> => {
  await api.delete(
    `/farms/${farmId}`
  );
};

export const farmService = {
  getMyFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm,
};