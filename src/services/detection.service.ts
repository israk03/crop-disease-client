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

export interface DetectionListParams {
  status?: DetectionStatus;
  page?: number;
  limit?: number;
}

export interface DetectionListResponse {
  detections: Detection[];
  meta?: PaginationMeta;
}

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
  getMyDetections,
  getDetectionById,
  deleteDetection,
  toggleSharing,
};