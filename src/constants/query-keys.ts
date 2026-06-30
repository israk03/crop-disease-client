export interface QueryParams {
  status?: string;
  page?: number;
  limit?: number;
}

export const QUERY_KEYS = {
  AUTH: {
    ME: ["auth", "me"] as const,
  },

  DASHBOARD: {
    FARMER: ["dashboard", "farmer"] as const,
    EXPERT: ["dashboard", "expert"] as const,
    ADMIN: ["dashboard", "admin"] as const,
  },

  DETECTIONS: {
    ALL: ["detections"] as const,

    LIST: (params?: QueryParams) =>
      ["detections", "list", params] as const,

    DETAIL: (
      id: string | number
    ) =>
      ["detections","detail", id] as const,
  },

  FARMS: {
    ALL: ["farms"] as const,

    LIST: (params?: QueryParams) =>
      ["farms", "list", params] as const,

    DETAIL: (
      id: string | number
    ) =>
      ["farms", id] as const,

    CROPS: (
      farmId: string | number
    ) =>
      ["farms", farmId, "crops"] as const,

    CROP: (
      farmId: string | number,
      cropId: string | number
    ) =>
      [
        "farms",
        farmId,
        "crops",
        cropId,
      ] as const,
  },

  POSTS: {
    ALL: ["posts"] as const,

    LIST: (params?: QueryParams) =>
      ["posts", "list", params] as const,

    TRENDING: [
      "posts",
      "trending",
    ] as const,

    DETAIL: (
      id: string | number
    ) =>
      ["posts", id] as const,

    COMMENTS: (
      postId: string | number
    ) =>
      [
        "posts",
        postId,
        "comments",
      ] as const,
  },

  CONSULTATIONS: {
    ALL: ["consultations"] as const,

    LIST: (params?: QueryParams) =>
      [
        "consultations",
        "list",
        params,
      ] as const,

    DETAIL: (
      id: string | number
    ) =>
      ["consultations", id] as const,

    MESSAGES: (
      id: string | number
    ) =>
      [
        "consultations",
        id,
        "messages",
      ] as const,
  },

  NOTIFICATIONS: {
    ALL: ["notifications"] as const,

    LIST: (params?: QueryParams) =>
      [
        "notifications",
        "list",
        params,
      ] as const,

    UNREAD_COUNT: [
      "notifications",
      "unread-count",
    ] as const,
  },

  ALERTS: {
    ALL: ["alerts"] as const,

    LIST: (params?: QueryParams) =>
      ["alerts", "list", params] as const,

    DETAIL: (
      id: string | number
    ) =>
      ["alerts", id] as const,

    MY_REGION: [
      "alerts",
      "my-region",
    ] as const,
  },

  OUTBREAKS: {
    ALL: ["outbreaks"] as const,

    MAP: ["outbreaks", "map"] as const,

    REGIONAL: [
      "outbreaks",
      "regional",
    ] as const,
  },

  WEATHER: {
    FARM: (
      farmId: string | number
    ) =>
      [
        "weather",
        "farm",
        farmId,
      ] as const,

    LOCATION: (
      lat: number,
      lon: number
    ) =>
      [
        "weather",
        "location",
        lat,
        lon,
      ] as const,
  },

  EXPERTS: {
    ALL: ["experts"] as const,

    LIST: (params?: QueryParams) =>
      [
        "experts",
        "list",
        params,
      ] as const,

    DETAIL: (
      id: string | number
    ) =>
      ["experts", id] as const,

    REVIEWS: (
      id: string | number
    ) =>
      [
        "experts",
        id,
        "reviews",
      ] as const,
  },

  SEARCH: {
    GLOBAL: (
      query: string,
      type?: string
    ) =>
      [
        "search",
        query,
        type,
      ] as const,
  },

  ADMIN: {
    STATS: [
      "admin",
      "stats",
    ] as const,

    USERS: (
      params?: QueryParams
    ) =>
      [
        "admin",
        "users",
        params,
      ] as const,

    USER: (
      id: string | number
    ) =>
      [
        "admin",
        "users",
        id,
      ] as const,

    DETECTIONS: (
      params?: QueryParams
    ) =>
      [
        "admin",
        "detections",
        params,
      ] as const,

    ANALYTICS: {
      DETECTIONS: [
        "admin",
        "analytics",
        "detections",
      ] as const,

      DISEASES: [
        "admin",
        "analytics",
        "diseases",
      ] as const,

      REGIONAL: [
        "admin",
        "analytics",
        "regional",
      ] as const,

      CONSULTATIONS: [
        "admin",
        "analytics",
        "consultations",
      ] as const,

      COMMUNITY: [
        "admin",
        "analytics",
        "community",
      ] as const,
    },
  },
} as const;