import { api } from "@/lib/axios";

import type {
  ApiResponse,
  Farm,
  Crop,
} from "@/types/api.types";

function assertResponseData<T>(
  data: T | undefined,
  message: string
): T {
  if (!data) {
    throw new Error(message);
  }

  return data;
}

export interface CreateFarmPayload {
  name: string;
  size: number;
  soilType: Farm["soilType"];
  address: string;
  region: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface UpdateFarmPayload {
  name?: string;
  size?: number;
  soilType?: Farm["soilType"];
  address?: string;
  region?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface CreateCropPayload {
  name: string;
  variety?: string;
  plantingDate: string;
  expectedHarvestDate?: string;
  notes?: string;
}

export interface UpdateCropPayload {
  name?: string;
  variety?: string;
  plantingDate?: string;
  expectedHarvestDate?: string;
  status?: Crop["status"];
  notes?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Farm Operations
// ─────────────────────────────────────────────────────────────────────────────

const getMyFarms = async (): Promise<Farm[]> => {
  const response = await api.get<
    ApiResponse<{
      farms: Farm[];
    }>
  >("/farms");

  return assertResponseData(
    response.data.data?.farms,
    "Failed to fetch farms"
  );
};

const getFarmById = async (
  farmId: string
): Promise<Farm> => {
  const response = await api.get<
    ApiResponse<{
      farm: Farm;
    }>
  >(`/farms/${farmId}`);

  return assertResponseData(
    response.data.data?.farm,
    "Farm not found"
  );
};

const createFarm = async (
  payload: CreateFarmPayload
): Promise<Farm> => {
  const response = await api.post<
    ApiResponse<{
      farm: Farm;
    }>
  >("/farms", payload);

  return assertResponseData(
    response.data.data?.farm,
    "Failed to create farm"
  );
};

const updateFarm = async (
  farmId: string,
  payload: UpdateFarmPayload
): Promise<Farm> => {
  const response = await api.patch<
    ApiResponse<{
      farm: Farm;
    }>
  >(`/farms/${farmId}`, payload);

  return assertResponseData(
    response.data.data?.farm,
    "Failed to update farm"
  );
};

const deleteFarm = async (
  farmId: string
): Promise<void> => {
  await api.delete(`/farms/${farmId}`);
};

// ─────────────────────────────────────────────────────────────────────────────
// Crop Operations
// ─────────────────────────────────────────────────────────────────────────────

const getCropsForFarm = async (
  farmId: string
): Promise<Crop[]> => {
  const response = await api.get<
    ApiResponse<{
      crops: Crop[];
    }>
  >(`/farms/${farmId}/crops`);

  return assertResponseData(
    response.data.data?.crops,
    "Failed to fetch crops"
  );
};

const getCropById = async (
  farmId: string,
  cropId: string
): Promise<Crop> => {
  const response = await api.get<
    ApiResponse<{
      crop: Crop;
    }>
  >(`/farms/${farmId}/crops/${cropId}`);

  return assertResponseData(
    response.data.data?.crop,
    "Crop not found"
  );
};

const addCrop = async (
  farmId: string,
  payload: CreateCropPayload
): Promise<Crop> => {
  const response = await api.post<
    ApiResponse<{
      crop: Crop;
    }>
  >(`/farms/${farmId}/crops`, payload);

  return assertResponseData(
    response.data.data?.crop,
    "Failed to add crop"
  );
};

const updateCrop = async (
  farmId: string,
  cropId: string,
  payload: UpdateCropPayload
): Promise<Crop> => {
  const response = await api.patch<
    ApiResponse<{
      crop: Crop;
    }>
  >(`/farms/${farmId}/crops/${cropId}`, payload);

  return assertResponseData(
    response.data.data?.crop,
    "Failed to update crop"
  );
};

const deleteCrop = async (
  farmId: string,
  cropId: string
): Promise<void> => {
  await api.delete(
    `/farms/${farmId}/crops/${cropId}`
  );
};

export const farmService = {
  getMyFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm,

  getCropsForFarm,
  getCropById,
  addCrop,
  updateCrop,
  deleteCrop,
};