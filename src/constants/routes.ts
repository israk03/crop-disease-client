export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  SEARCH: "/search",

  COMMUNITY: "/community",
  COMMUNITY_POST: (id: string | number) =>
    `/community/${id}`,

  EXPERTS: "/experts",
  EXPERT_PROFILE: (id: string | number) =>
    `/experts/${id}`,

  // Farmer
  FARMER: {
    ROOT: "/farmer",

    DASHBOARD: "/dashboard",

    FARMS: "/farms",

    FARM: (farmId: string | number) =>
      `/farms/${farmId}`,

    FARM_CROPS: (farmId: string | number) =>
      `/farms/${farmId}/crops`,

    CROP: (
      farmId: string | number,
      cropId: string | number
    ) =>
      `/farms/${farmId}/crops/${cropId}`,

    DETECT: "/detect",

    DETECTIONS: "/detections",

    DETECTION: (id: string | number) =>
      `/detections/${id}`,

    EXPERTS: "/experts",

    EXPERT: (id: string | number) =>
      `/experts/${id}`,

    CONSULTATIONS:
      "/consultations",

    CONSULTATION: (
      id: string | number
    ) =>
      `/consultations/${id}`,

    COMMUNITY:
      "/community",

    POST: (id: string | number) =>
      `/community/${id}`,

    WEATHER: "/weather",

    ALERTS: "/alerts",

    NOTIFICATIONS:
      "/notifications",

    PROFILE: "/profile",

    SETTINGS: "/settings",
  },

  // Expert
  EXPERT: {
    ROOT: "/expert",

    DASHBOARD:
      "/dashboard",

    CONSULTATIONS:
      "/expert/consultations",

    CONSULTATION: (
      id: string | number
    ) =>
      `/expert/consultations/${id}`,

    COMMUNITY:
      "/expert/community",

    POST: (id: string | number) =>
      `/expert/community/${id}`,

    REVIEWS:
      "/expert/reviews",

    NOTIFICATIONS:
      "/expert/notifications",

    PROFILE:
      "/expert/profile",

    SETTINGS:
      "/expert/settings",
  },

  // Admin
  ADMIN: {
    ROOT: "/admin",

    DASHBOARD:
      "/dashboard",

    USERS:
      "/admin/users",

    EXPERTS:
      "/admin/experts",

    DETECTIONS:
      "/admin/detections",

    DETECTION: (
      id: string | number
    ) =>
      `/admin/detections/${id}`,

    CONSULTATIONS:
      "/admin/consultations",

    ANALYTICS:
      "/admin/analytics",

    ALERTS:
      "/admin/alerts",

    ALERT: (id: string | number) =>
      `/admin/alerts/${id}`,

    OUTBREAKS:
      "/admin/outbreaks",

    REPORTS:
      "/admin/reports",

    NOTIFICATIONS:
      "/admin/notifications",

    PROFILE:
      "/admin/profile",

    SETTINGS:
      "/admin/settings",
  },
} as const;