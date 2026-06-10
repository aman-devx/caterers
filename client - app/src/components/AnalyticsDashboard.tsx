"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { fetchCatererAnalytics } from "@/lib/api";

type Period = "daily" | "weekly" | "monthly" | "yearly";

export interface AnalyticsData {
  period: string;
  totalProfileViews: number;
  totalBookings: number;
  monthlyBookings: number;
  periodBookings: number;
  revenue: number;
  acceptedBookings: number;
  averageRating: number;
  conversionRate: number;
  popularDishes: { name: string; views: number }[];
  mostViewedMenus: { name: string; views: number }[];
  customerEngagement: number;
  viewsOverTime: { date: string; count: number }[];
  bookingsOverTime: { date: string; count: number }[];
  revenueOverTime: { date: string; amount: number }[];
  recentActivity: { type: string; label: string; date: string }[];
}

const PERIODS: { id: Period; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

function exportCsv(data: AnalyticsData) {
  const rows = [
    ["Metric", "Value"],
    ["Total Profile Views", data.totalProfileViews],
    ["Total Bookings", data.totalBookings],
    ["Monthly Bookings", data.monthlyBookings],
    ["Revenue", data.revenue],
    ["Average Rating", data.averageRating],
    ["Conversion Rate %", data.conversionRate],
    ["Customer Engagement", data.customerEngagement],
    [],
    ["Popular Dish", "Views"],
    ...data.popularDishes.map((d) => [d.name, d.views]),
  ];
  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `analytics-${data.period}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AnalyticsDashboard({ initial }: { initial?: AnalyticsData }) {
  const [period, setPeriod] = useState<Period>("monthly");
  const [data, setData] = useState<AnalyticsData | null>(initial || null);
  const [loading, setLoading] = useState(!initial);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await fetchCatererAnalytics(period));
    } catch {
      /* keep previous */
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  if (!data && loading) {
    return <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" /></div>;
  }
  if (!data) return null;

  const stats = [
    { label: "Profile Views", value: data.totalProfileViews.toLocaleString() },
    { label: "Total Bookings", value: data.totalBookings },
    { label: "Monthly Bookings", value: data.monthlyBookings },
    { label: "Revenue", value: `₹${data.revenue.toLocaleString("en-IN")}` },
    { label: "Avg Rating", value: `${data.averageRating} ★` },
    { label: "Conversion", value: `${data.conversionRate}%` },
    { label: "Engagement", value: data.customerEngagement },
    { label: "Accepted", value: data.acceptedBookings },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-xl border border-stone-200 bg-white p-1">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPeriod(p.id)}
              className={`interactive rounded-lg px-3 py-1.5 text-sm font-medium ${period === p.id ? "bg-amber-600 text-white" : "text-stone-600 hover:bg-stone-50"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => exportCsv(data)} className="interactive rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50">
          Export CSV
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-stone-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-stone-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="mb-4 font-semibold text-stone-900">Profile Views</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data.viewsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#d97706" fill="#fef3c7" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="mb-4 font-semibold text-stone-900">Bookings</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.bookingsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#d97706" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="mb-4 font-semibold text-stone-900">Popular Dishes</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.popularDishes} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="views" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="mb-4 font-semibold text-stone-900">Recent Activity</h3>
          <ul className="max-h-[220px] space-y-2 overflow-y-auto">
            {data.recentActivity.map((a, i) => (
              <li key={i} className="flex items-start justify-between gap-2 rounded-lg bg-stone-50 px-3 py-2 text-sm">
                <span className="text-stone-700">{a.label}</span>
                <span className="shrink-0 text-xs text-stone-400">{new Date(a.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
