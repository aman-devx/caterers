import type { Caterer } from "./caterer";

export type UserRole = "admin" | "caterer";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  catererId?: string | null;
  caterer?: Caterer;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface DemoCredential {
  role: string;
  email: string;
  password: string;
  description: string;
  color: string;
}
