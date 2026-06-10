/**
 * Single source of truth for backend API URL.
 *
 * Frontend (Next.js): https://catarers-app.vercel.app
 * Backend  (Express): https://caterers-api.vercel.app
 *
 * Local override: client/.env.local → NEXT_PUBLIC_API_URL=http://localhost:4000
 */
const DEFAULT_API_URL = "https://caterers-api.vercel.app";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL
).replace(/\/$/, "");
