import { api } from "@/lib/axios";

import type {
  ApiResponse,
  Detection,
  PaginationMeta,
  DetectionStatus,
} from "@/types/api.types";


export interface DetectionListParams {
  status?: DetectionStatus;
  page?: number;
  limit?: number;
}

export interface DetectionListResponse {
  detections: Detection[];
  meta?: PaginationMeta;
}

export interface CreateDetectionPayload {
  image: File;
  cropType: string;
  farmId?: string;
  cropId?: string;
}

const createDetection = async (
  payload: CreateDetectionPayload
): Promise<Detection> => {
  const formData = new FormData();

  formData.append("image", payload.image);
  formData.append("cropType", payload.cropType);

  if (payload.farmId) {
    formData.append("farmId", payload.farmId);
  }

  if (payload.cropId) {
    formData.append("cropId", payload.cropId);
  }

  const response = await api.post<
    ApiResponse<{
      detection: Detection;
    }>
  >("/detections", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!response.data.data?.detection) {
    throw new Error("Failed to create detection");
  }

  return response.data.data.detection;
};

const getMyDetections = async (
  params?: DetectionListParams
): Promise<DetectionListResponse> => {
  const response = await api.get<
    ApiResponse<{
      detections: Detection[];
    }>
  >("/detections", {
    params,
  });

  if (!response.data.data?.detections) {
    throw new Error(
      "Failed to fetch detections"
    );
  }

  return {
    detections:
      response.data.data.detections,
    meta: response.data.meta,
  };
};

const getDetectionById = async (
  id: string
): Promise<Detection> => {
  const response = await api.get<
    ApiResponse<{
      detection: Detection;
    }>
  >(`/detections/${id}`);

  if (!response.data.data?.detection) {
    throw new Error(
      "Detection not found"
    );
  }

  return response.data.data.detection;
};

const deleteDetection = async (
  id: string
): Promise<void> => {
  await api.delete(
    `/detections/${id}`
  );
};

const toggleSharing = async (
  id: string
): Promise<Detection> => {
  const response = await api.patch<
    ApiResponse<{
      detection: Detection;
    }>
  >(`/detections/${id}/share`);

  if (!response.data.data?.detection) {
    throw new Error(
      "Failed to update sharing status"
    );
  }

  return response.data.data.detection;
};

export const detectionService = {
  createDetection,
  getMyDetections,
  getDetectionById,
  deleteDetection,
  toggleSharing,
};