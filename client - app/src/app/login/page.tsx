"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import PasswordInput from "@/components/PasswordInput";
import { useAuth } from "@/context/AuthContext";
import { DEMO_CREDENTIALS } from "@/lib/demoCredentials";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  function fillCredential(credEmail: string, credPassword: string, role: string) {
    setEmail(credEmail);
    setPassword(credPassword);
    setSelectedCard(role);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-stone-200/80 bg-white p-8 shadow-sm">
              <div className="mb-8">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-2xl shadow-md">
                  🔐
                </span>
                <h1 className="mt-4 text-2xl font-bold text-stone-900">Welcome back</h1>
                <p className="mt-2 text-sm text-stone-500">
                  Sign in to manage caterers, categories, or your menu
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-stone-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 outline-none transition-all placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-stone-700">
                    Password
                  </label>
                  <PasswordInput id="password" value={password} onChange={setPassword} />
                </div>

                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="interactive w-full rounded-xl bg-stone-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
              Demo credentials — click to fill
            </p>
            <div className="space-y-3">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.role}
                  type="button"
                  onClick={() => fillCredential(cred.email, cred.password, cred.role)}
                  className={`interactive w-full rounded-2xl border p-4 text-left transition-all ${
                    selectedCard === cred.role
                      ? "border-amber-400 bg-amber-50 shadow-md ring-2 ring-amber-200"
                      : "border-stone-200 bg-white hover:border-amber-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cred.color} text-xs font-bold text-white`}
                    >
                      {cred.role[0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-stone-900">{cred.role}</p>
                      <p className="truncate text-xs text-stone-500">{cred.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 rounded-lg bg-stone-50 px-3 py-2 font-mono text-xs text-stone-700">
                    <p>{cred.email}</p>
                    <p className="text-stone-500">{cred.password}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-stone-500">
          Browsing as a guest?{" "}
          <Link href="/caterers" className="font-medium text-amber-700 transition-colors hover:text-amber-900">
            Explore caterers
          </Link>
        </p>
      </main>
    </div>
  );
}
