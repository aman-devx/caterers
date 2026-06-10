"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import StarRating from "@/components/StarRating";
import { createCatererWithLogin, deleteCaterer, fetchAdminCaterers } from "@/lib/api";
import type { Caterer } from "@/types/caterer";

const emptyForm = {
  name: "",
  location: "",
  pricePerPlate: "",
  cuisines: "",
  rating: "4.5",
  description: "",
  email: "",
  password: "",
};

function AdminDashboard() {
  const [caterers, setCaterers] = useState<Caterer[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCaterers = useCallback(async () => {
    try {
      const data = await fetchAdminCaterers();
      setCaterers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load caterers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCaterers();
  }, [loadCaterers]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const result = await createCatererWithLogin({
        name: form.name.trim(),
        location: form.location.trim(),
        pricePerPlate: Number(form.pricePerPlate),
        cuisines: form.cuisines.split(",").map((c) => c.trim()).filter(Boolean),
        rating: Number(form.rating),
        description: form.description.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setSuccess(`Created "${result.caterer.name}" — login: ${result.credentials.email}`);
      setForm(emptyForm);
      await loadCaterers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create caterer");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}" and all their menu items?`)) return;

    try {
      await deleteCaterer(id);
      setSuccess(`Deleted "${name}"`);
      await loadCaterers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Admin Panel</p>
          <h1 className="mt-1 text-3xl font-bold text-stone-900">Manage Caterers</h1>
          <p className="mt-2 text-stone-600">Add caterers and create their login credentials.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold text-stone-900">Add New Caterer</h2>

            {["name", "location", "email", "password"].map((field) => (
              <div key={field}>
                <label className="mb-1 block text-sm font-medium capitalize text-stone-700">{field}</label>
                <input
                  type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                  required={field !== "password" || true}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Price/plate (₹)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={form.pricePerPlate}
                  onChange={(e) => setForm({ ...form, pricePerPlate: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Rating</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Cuisines (comma-separated)</label>
              <input
                required
                value={form.cuisines}
                onChange={(e) => setForm({ ...form, cuisines: e.target.value })}
                placeholder="North Indian, Punjabi"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-stone-700">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            {success && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-amber-600 py-2.5 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Caterer + Login"}
            </button>
          </form>

          <div className="lg:col-span-3">
            <h2 className="mb-4 text-lg font-semibold text-stone-900">
              All Caterers ({caterers.length})
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-3">
                {caterers.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-stone-900">{c.name}</h3>
                        {c.hasLogin ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
                            Has login
                          </span>
                        ) : (
                          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-stone-500">
                            No login
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-stone-500">{c.location}</p>
                      <div className="mt-1 flex items-center gap-3">
                        <StarRating rating={c.rating} size="sm" />
                        <span className="text-sm font-medium text-stone-700">
                          ₹{c.pricePerPlate}/plate
                        </span>
                      </div>
                      {c.loginEmail && (
                        <p className="mt-1 text-xs text-stone-400">Login: {c.loginEmail}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id, c.name)}
                      className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
