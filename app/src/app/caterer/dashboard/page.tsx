"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";
import SafeImage from "@/components/SafeImage";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import {
  catererApi,
  createMenuItem,
  deleteMenuItem,
  fetchCatererDashboard,
  updateCatererProfile,
  uploadCatererImage,
} from "@/lib/api";
import type { CatererDashboardData } from "@/types/caterer";

const TABS = ["Analytics", "Profile", "Menu", "Gallery", "Services", "Packages", "Testimonials", "Ads", "Bookings"] as const;
type Tab = (typeof TABS)[number];

function Dashboard() {
  const [data, setData] = useState<CatererDashboardData | null>(null);
  const [tab, setTab] = useState<Tab>("Analytics");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      setData(await fetchCatererDashboard());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" /></div>;
  if (!data) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Caterer Portal</p>
          <h1 className="text-3xl font-bold text-stone-900">{data.profile.name}</h1>
        </div>

        {msg && <p className="mb-4 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{msg}</p>}
        {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

        <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-stone-200 bg-white p-1">
          {TABS.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`interactive shrink-0 rounded-lg px-3 py-2 text-xs font-medium sm:text-sm ${tab === t ? "bg-amber-600 text-white" : "text-stone-600 hover:bg-stone-50"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "Analytics" && <AnalyticsDashboard initial={data.analytics} />}
        {tab === "Profile" && <ProfileTab profile={data.profile} onSave={async (p) => { await updateCatererProfile(p); setMsg("Profile updated"); load(); }} />}
        {tab === "Menu" && <MenuTab menu={data.menu} categories={data.menuCategories} onRefresh={load} setMsg={setMsg} />}
        {tab === "Gallery" && <GalleryTab gallery={data.profile.gallery || []} onRefresh={load} setMsg={setMsg} />}
        {tab === "Services" && <ServicesTab services={data.services} onRefresh={load} setMsg={setMsg} />}
        {tab === "Packages" && <PackagesTab packages={data.packages} onRefresh={load} setMsg={setMsg} />}
        {tab === "Testimonials" && <TestimonialsTab items={data.testimonials} onRefresh={load} setMsg={setMsg} />}
        {tab === "Ads" && <AdsTab ads={data.advertisements} onRefresh={load} setMsg={setMsg} />}
        {tab === "Bookings" && <BookingsTab bookings={data.bookings} onRefresh={load} setMsg={setMsg} />}
      </main>
    </div>
  );
}

function ProfileTab({ profile, onSave }: { profile: CatererDashboardData["profile"]; onSave: (p: Record<string, unknown>) => Promise<void> }) {
  const [form, setForm] = useState({ name: profile.name, location: profile.location, description: profile.description || "", phone: profile.phone || "", email: profile.email || "", website: profile.website || "", coverImage: profile.coverImage || "", logo: profile.logo || "" });
  return (
    <form onSubmit={async (e) => { e.preventDefault(); await onSave(form); }} className="max-w-xl space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
      {["name", "location", "phone", "email", "website", "coverImage", "logo"].map((f) => (
        <div key={f}>
          <label className="mb-1 block text-sm font-medium capitalize text-stone-700">{f}</label>
          <input value={form[f as keyof typeof form]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900" />
        </div>
      ))}
      <div>
        <label className="mb-1 block text-sm font-medium text-stone-700">Description</label>
        <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900" />
      </div>
      <button type="submit" className="interactive rounded-xl bg-amber-600 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-700">Save Profile</button>
    </form>
  );
}

function MenuTab({ menu, categories, onRefresh, setMsg }: { menu: CatererDashboardData["menu"]; categories: CatererDashboardData["menuCategories"]; onRefresh: () => void; setMsg: (s: string) => void }) {
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", isAvailable: true });
  const [catName, setCatName] = useState("");
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5">
        <h3 className="font-semibold">Add Menu Item</h3>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <input placeholder="Category" list="cats" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <datalist id="cats">{categories.map((c) => <option key={c.id} value={c.name} />)}</datalist>
        <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <button type="button" onClick={async () => { await createMenuItem({ ...form, price: Number(form.price), images: [] }); setMsg("Item added"); onRefresh(); setForm({ name: "", description: "", price: "", category: "", isAvailable: true }); }} className="interactive rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white">Add Item</button>
        <div className="border-t pt-4">
          <input placeholder="New category name" value={catName} onChange={(e) => setCatName(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
          <button type="button" onClick={async () => { await catererApi("/menu-categories", "POST", { name: catName }); setCatName(""); setMsg("Category added"); onRefresh(); }} className="interactive mt-2 text-sm text-amber-700">+ Add Category</button>
        </div>
      </div>
      <div className="space-y-2">
        {menu.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-4">
            <div><p className="font-medium text-stone-900">{item.name}</p><p className="text-sm text-stone-500">{item.category} · ₹{item.price}</p></div>
            <button type="button" onClick={async () => { await deleteMenuItem(item.id); onRefresh(); }} className="interactive text-xs text-red-600">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTab({ gallery, onRefresh, setMsg }: { gallery: string[]; onRefresh: () => void; setMsg: (s: string) => void }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; const url = await uploadCatererImage(f); await catererApi("/gallery", "POST", { url }); setMsg("Image added"); onRefresh(); }} className="text-sm" />
      <div className="mt-4 grid grid-cols-3 gap-3">
        {gallery.map((url) => (
          <div key={url} className="relative aspect-video overflow-hidden rounded-xl">
            <SafeImage src={url} alt="Gallery" fill sizes="200px" className="object-cover" />
            <button type="button" onClick={async () => { await catererApi("/gallery", "DELETE", { url }); onRefresh(); }} className="interactive absolute right-1 top-1 rounded bg-red-600 px-1.5 py-0.5 text-[10px] text-white">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesTab({ services, onRefresh, setMsg }: { services: CatererDashboardData["services"]; onRefresh: () => void; setMsg: (s: string) => void }) {
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
        <input placeholder="Service name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <button type="button" onClick={async () => { await catererApi("/services", "POST", { ...form, price: Number(form.price) }); setForm({ name: "", description: "", price: "" }); setMsg("Service added"); onRefresh(); }} className="interactive rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white">Add Service</button>
      </div>
      <div className="space-y-2">{services.map((s) => (
        <div key={s.id} className="flex justify-between rounded-xl border bg-white p-4">
          <div><p className="font-medium">{s.name}</p><p className="text-sm text-stone-500">{s.description}</p></div>
          <button type="button" onClick={async () => { await catererApi(`/services/${s.id}`, "DELETE"); onRefresh(); }} className="text-xs text-red-600">Delete</button>
        </div>
      ))}</div>
    </div>
  );
}

function PackagesTab({ packages, onRefresh, setMsg }: { packages: CatererDashboardData["packages"]; onRefresh: () => void; setMsg: (s: string) => void }) {
  const [form, setForm] = useState({ name: "", description: "", price: "", includes: "" });
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
        <input placeholder="Package name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <input placeholder="Price per plate" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <input placeholder="Includes (comma-separated)" value={form.includes} onChange={(e) => setForm({ ...form, includes: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <button type="button" onClick={async () => { await catererApi("/packages", "POST", { name: form.name, description: form.description, price: Number(form.price), includes: form.includes.split(",").map((s) => s.trim()).filter(Boolean) }); setForm({ name: "", description: "", price: "", includes: "" }); setMsg("Package added"); onRefresh(); }} className="interactive rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white">Add Package</button>
      </div>
      <div className="space-y-2">{packages.map((p) => (
        <div key={p.id} className="rounded-xl border bg-white p-4">
          <div className="flex justify-between"><p className="font-medium">{p.name}</p><button type="button" onClick={async () => { await catererApi(`/packages/${p.id}`, "DELETE"); onRefresh(); }} className="text-xs text-red-600">Delete</button></div>
          <p className="text-amber-700 font-bold">₹{p.price}/plate</p>
        </div>
      ))}</div>
    </div>
  );
}

function TestimonialsTab({ items, onRefresh, setMsg }: { items: CatererDashboardData["testimonials"]; onRefresh: () => void; setMsg: (s: string) => void }) {
  const [form, setForm] = useState({ customerName: "", text: "", rating: "5", eventType: "", featured: false });
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
        <input placeholder="Customer name" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <textarea placeholder="Testimonial" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <input placeholder="Event type" value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <input placeholder="Rating 1-5" type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
        <button type="button" onClick={async () => { await catererApi("/testimonials", "POST", { ...form, rating: Number(form.rating) }); setForm({ customerName: "", text: "", rating: "5", eventType: "", featured: false }); setMsg("Testimonial added"); onRefresh(); }} className="interactive rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white">Add Testimonial</button>
      </div>
      <div className="space-y-2">{items.map((t) => (
        <div key={t.id} className="rounded-xl border bg-white p-4">
          <div className="flex justify-between"><p className="font-medium">{t.customerName} {"★".repeat(t.rating)}</p><button type="button" onClick={async () => { await catererApi(`/testimonials/${t.id}`, "DELETE"); onRefresh(); }} className="text-xs text-red-600">Delete</button></div>
          <p className="mt-1 text-sm text-stone-600">{t.text}</p>
        </div>
      ))}</div>
    </div>
  );
}

function AdsTab({ ads, onRefresh, setMsg }: { ads: CatererDashboardData["advertisements"]; onRefresh: () => void; setMsg: (s: string) => void }) {
  const [form, setForm] = useState({ title: "", image: "", isActive: true });
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
        <input placeholder="Ad title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full rounded-lg border px-3 py-2 text-sm text-stone-900" />
        <input type="file" accept="image/*" onChange={async (e) => { const f = e.target.files?.[0]; if (f) setForm({ ...form, image: await uploadCatererImage(f) }); }} className="text-sm" />
        <button type="button" onClick={async () => { await catererApi("/advertisements", "POST", form); setForm({ title: "", image: "", isActive: true }); setMsg("Ad created"); onRefresh(); }} className="interactive rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white">Create Ad</button>
      </div>
      <div className="space-y-2">{ads.map((a) => (
        <div key={a.id} className="rounded-xl border bg-white p-4">
          <div className="flex justify-between"><p className="font-medium">{a.title}</p>
            <div className="flex gap-2">
              <button type="button" onClick={async () => { await catererApi(`/advertisements/${a.id}`, "PUT", { isActive: !a.isActive }); onRefresh(); }} className="text-xs text-amber-700">{a.isActive ? "Disable" : "Enable"}</button>
              <button type="button" onClick={async () => { await catererApi(`/advertisements/${a.id}`, "DELETE"); onRefresh(); }} className="text-xs text-red-600">Delete</button>
            </div>
          </div>
          <p className="text-xs text-stone-500">Views: {a.views || 0} · Clicks: {a.clicks || 0}</p>
        </div>
      ))}</div>
    </div>
  );
}

function BookingsTab({ bookings, onRefresh, setMsg }: { bookings: CatererDashboardData["bookings"]; onRefresh: () => void; setMsg: (s: string) => void }) {
  return (
    <div className="space-y-3">
      {bookings.length === 0 ? <p className="text-stone-500">No bookings yet.</p> : bookings.map((b) => (
        <div key={b.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4">
          <div>
            <p className="font-medium text-stone-900">{b.customerName}</p>
            <p className="text-sm text-stone-500">{b.email} · {b.guests} guests · {new Date(b.eventDate).toLocaleDateString()}</p>
            <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${b.status === "pending" ? "bg-amber-100 text-amber-800" : b.status === "accepted" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>{b.status}</span>
          </div>
          {b.status === "pending" && (
            <div className="flex gap-2">
              <button type="button" onClick={async () => { await catererApi(`/bookings/${b.id}`, "PUT", { status: "accepted" }); setMsg("Booking accepted"); onRefresh(); }} className="interactive rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white">Accept</button>
              <button type="button" onClick={async () => { await catererApi(`/bookings/${b.id}`, "PUT", { status: "rejected" }); setMsg("Booking rejected"); onRefresh(); }} className="interactive rounded-lg bg-red-600 px-3 py-1 text-xs font-medium text-white">Reject</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function CatererDashboardPage() {
  return <ProtectedRoute role="caterer"><Dashboard /></ProtectedRoute>;
}
