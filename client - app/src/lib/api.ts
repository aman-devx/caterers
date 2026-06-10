import type { Caterer, CatererDashboardData, CatererFullProfile, DashboardAnalytics } from "@/types/caterer";
import type { Category, CategoryDetail } from "@/types/category";
import type { SearchSuggestions } from "@/types/category";
import type { LoginResponse, AuthUser } from "@/types/user";
import type { MenuItem } from "@/types/menu";
import { API_BASE_URL } from "./config";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data as T;
}

export async function fetchCaterers(): Promise<Caterer[]> {
  return apiFetch<Caterer[]>("/api/caterers");
}

export async function fetchCatererById(id: string): Promise<CatererFullProfile> {
  return apiFetch<CatererFullProfile>(`/api/caterers/${id}`);
}

export async function fetchCatererMenu(id: string): Promise<MenuItem[]> {
  return apiFetch<MenuItem[]>(`/api/caterers/${id}/menu`);
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchMe(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/api/auth/me");
}

export async function fetchAdminCaterers(): Promise<Caterer[]> {
  return apiFetch<Caterer[]>("/api/admin/caterers");
}

export async function createCatererWithLogin(data: {
  name: string;
  location: string;
  pricePerPlate: number;
  cuisines: string[];
  rating: number;
  description?: string;
  email: string;
  password: string;
}): Promise<{ caterer: Caterer; credentials: { email: string; role: string } }> {
  return apiFetch("/api/admin/caterers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteCaterer(id: string): Promise<void> {
  await apiFetch(`/api/admin/caterers/${id}`, { method: "DELETE" });
}

export async function fetchCatererProfile(): Promise<Caterer> {
  return apiFetch<Caterer>("/api/caterer/profile");
}

export async function fetchCatererDashboard(period = "monthly"): Promise<CatererDashboardData> {
  return apiFetch<CatererDashboardData>(`/api/caterer/dashboard?period=${period}`);
}

export async function fetchCatererAnalytics(period = "monthly"): Promise<DashboardAnalytics> {
  return apiFetch<DashboardAnalytics>(`/api/caterer/analytics?period=${period}`);
}

export async function updateCatererProfile(data: Partial<Caterer>): Promise<Caterer> {
  return apiFetch<Caterer>("/api/caterer/profile", { method: "PUT", body: JSON.stringify(data) });
}

export async function submitBooking(
  catererId: string,
  data: { customerName: string; email: string; phone?: string; eventDate: string; guests: number; message?: string }
): Promise<{ id: string; message: string }> {
  return apiFetch(`/api/caterers/${catererId}/bookings`, { method: "POST", body: JSON.stringify(data) });
}

export async function catererApi<T>(path: string, method: string, body?: unknown): Promise<T> {
  const opts: RequestInit = { method };
  if (body !== undefined) opts.body = JSON.stringify(body);
  return apiFetch<T>(`/api/caterer${path}`, opts);
}

export async function fetchMyMenu(): Promise<MenuItem[]> {
  return apiFetch<MenuItem[]>("/api/caterer/menu");
}

export async function createMenuItem(data: Omit<MenuItem, "id" | "catererId">): Promise<MenuItem> {
  return apiFetch<MenuItem>("/api/caterer/menu", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateMenuItem(
  id: string,
  data: Partial<Omit<MenuItem, "id" | "catererId">>
): Promise<MenuItem> {
  return apiFetch<MenuItem>(`/api/caterer/menu/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteMenuItem(id: string): Promise<void> {
  await apiFetch(`/api/caterer/menu/${id}`, { method: "DELETE" });
}

export async function fetchCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/api/categories");
}

export async function fetchCategoryBySlug(slug: string): Promise<CategoryDetail> {
  return apiFetch<CategoryDetail>(`/api/categories/${slug}`);
}

export async function fetchSearchSuggestions(
  params: { q?: string; location?: string; category?: string },
  signal?: AbortSignal
): Promise<SearchSuggestions> {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.location) query.set("location", params.location);
  if (params.category) query.set("category", params.category);

  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/api/search/suggestions?${query.toString()}`, {
    cache: "no-store",
    signal,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.message || "Request failed");
  return data as SearchSuggestions;
}

export async function uploadCatererImage(file: File): Promise<string> {
  const token = getToken();
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE_URL}/api/caterer/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url;
}
