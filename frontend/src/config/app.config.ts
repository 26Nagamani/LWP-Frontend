export const APP_CONFIG = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://192.168.1.8:8000/api/v1",
} as const;