import { api } from "@/lib/axios";

import type {
  ApiResponse,
  WeatherCurrent,
  Advisory,
} from "@/types/api.types";

export interface WeatherSummary {
  avgTempNext24h: number;
  maxTempNext24h: number;
  minTempNext24h: number;

  totalRainfallNext24h: number;
  totalRainfallNext72h: number;

  avgHumidityNext24h: number;

  maxWindSpeedNext24h: number;

  hasThunderstormNext24h: boolean;
  hasFrostRiskNext24h: boolean;

  precipitationProbabilityNext24h: number;
}

export interface WeatherLocation {
  name: string;
  country: string;

  lat: number;
  lon: number;
}

export interface WeatherResponse {
  farm?: {
    id: string;
    name: string;
    region: string;
  };

  location: WeatherLocation;

  current: WeatherCurrent;

  summary: WeatherSummary;

  advisories: Advisory[];

  cropTypes?: string[];

  generatedAt: string;
}

const validateWeatherResponse = (
  data: WeatherResponse | undefined
): WeatherResponse => {
  if (!data) {
    throw new Error(
      "Failed to retrieve weather data"
    );
  }

  return data;
};

const getWeatherForFarm = async (
  farmId: string
): Promise<WeatherResponse> => {
  const response = await api.get<
    ApiResponse<WeatherResponse>
  >(`/weather/farm/${farmId}`);

  return validateWeatherResponse(
    response.data.data
  );
};

const getWeatherByLocation = async (
  lat: number,
  lon: number
): Promise<WeatherResponse> => {
  const response = await api.get<
    ApiResponse<WeatherResponse>
  >("/weather/location", {
    params: {
      lat,
      lon,
    },
  });

  return validateWeatherResponse(
    response.data.data
  );
};

export const weatherService = {
  getWeatherForFarm,
  getWeatherByLocation,
};