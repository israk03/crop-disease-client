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

    DASHBOARD: "/farmer/dashboard",

    FARMS: "/farmer/farms",

    FARM: (farmId: string | number) =>
      `/farmer/farms/${farmId}`,

    FARM_CROPS: (farmId: string | number) =>
      `/farmer/farms/${farmId}/crops`,

    CROP: (
      farmId: string | number,
      cropId: string | number
    ) =>
      `/farmer/farms/${farmId}/crops/${cropId}`,

    DETECT: "/farmer/detect",

    DETECTIONS: "/farmer/detections",

    DETECTION: (id: string | number) =>
      `/farmer/detections/${id}`,

    EXPERTS: "/farmer/experts",

    EXPERT: (id: string | number) =>
      `/farmer/experts/${id}`,

    CONSULTATIONS:
      "/farmer/consultations",

    CONSULTATION: (
      id: string | number
    ) =>
      `/farmer/consultations/${id}`,

    COMMUNITY:
      "/farmer/community",

    POST: (id: string | number) =>
      `/farmer/community/${id}`,

    WEATHER: "/farmer/weather",

    ALERTS: "/farmer/alerts",

    NOTIFICATIONS:
      "/farmer/notifications",

    PROFILE: "/farmer/profile",

    SETTINGS: "/farmer/settings",
  },

  // Expert
  EXPERT: {
    ROOT: "/expert",

    DASHBOARD:
      "/expert/dashboard",

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
      "/admin/dashboard",

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