export const appConfig = {
  app: {
    name: "AgriSense",
    description:
      "AI-Powered Agricultural Intelligence Platform",
    version: "1.0.0",

    url:
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000",
  },

  api: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:5000/api/v1",

    timeout: 30_000,
  },

  socket: {
    url:
      process.env.NEXT_PUBLIC_SOCKET_URL ??
      "http://localhost:5000",
  },

  auth: {
    accessTokenKey: "accessToken",
    refreshTokenKey: "refreshToken",
  },

  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },

  upload: {
    maxSizeBytes: 5 * 1024 * 1024,

    acceptedTypes: [
      "image/jpeg",
      "image/png",
      "image/webp",
    ],

    acceptedExtensions: [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
    ],
  },

  detection: {
    pollIntervalMs: 3000,
  },

  dashboard: {
    sidebarWidth: 260,
    collapsedSidebarWidth: 80,
  },

  roles: {
    ADMIN: "ADMIN",
    FARMER: "FARMER",
    EXPERT: "EXPERT",
  },
} as const;

export type UserRole =
  (typeof appConfig.roles)[keyof typeof appConfig.roles];