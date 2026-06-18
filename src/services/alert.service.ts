import { api } from "@/lib/axios";

import type {
  ApiResponse,
  Alert,
  PaginationMeta,
  OutbreakLevel,
} from "@/types/api.types";

export interface AlertFilters {
  region?: string;
  cropType?: string;
  outbreakLevel?: OutbreakLevel;

  page?: number;
  limit?: number;
}

export interface AlertListResponse {
  alerts: Alert[];
  meta?: PaginationMeta;
}

const getAlerts = async (
  params?: AlertFilters
): Promise<AlertListResponse> => {
  const response = await api.get<
    ApiResponse<{
      alerts: Alert[];
    }>
  >("/alerts", {
    params,
  });

  if (!response.data.data?.alerts) {
    throw new Error(
      "Failed to fetch alerts"
    );
  }

  return {
    alerts:
      response.data.data.alerts,
    meta: response.data.meta,
  };
};

const getMyRegionAlerts = async (): Promise<
  Alert[]
> => {
  const response = await api.get<
    ApiResponse<{
      alerts: Alert[];
    }>
  >("/alerts/my-region");

  if (!response.data.data?.alerts) {
    throw new Error(
      "Failed to fetch regional alerts"
    );
  }

  return response.data.data.alerts;
};

const getAlertById = async (
  id: string
): Promise<Alert> => {
  const response = await api.get<
    ApiResponse<{
      alert: Alert;
    }>
  >(`/alerts/${id}`);

  if (!response.data.data?.alert) {
    throw new Error(
      "Alert not found"
    );
  }

  return response.data.data.alert;
};

export const alertService = {
  getAlerts,
  getMyRegionAlerts,
  getAlertById,
};