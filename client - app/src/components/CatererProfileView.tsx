"use client";

import Link from "next/link";
import { useState } from "react";
import type { CatererFullProfile } from "@/types/caterer";
import SafeImage from "./SafeImage";
import StarRating from "./StarRating";
import ImageGallery from "./ImageGallery";
import StructuredMenuList from "./StructuredMenuList";
import { submitBooking } from "@/lib/api";

interface CatererProfileViewProps {
  caterer: CatererFullProfile;
}

export default function CatererProfileView({ caterer }: CatererProfileViewProps) {
  const [bookingForm, setBookingForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    eventDate: "",
    guests: "",
    message: "",
  });
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingError, setBookingError] = useState("");

  const menu = caterer.menuItems || [];
  const gallery = [...new Set([caterer.coverImage, ...(caterer.gallery || []), ...menu.flatMap((m) => m.images || [])].filter(Boolean))] as string[];

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    setBookingError("");
    setBookingMsg("");
    try {
      const res = await submitBooking(caterer.id, {
        ...bookingForm,
        guests: Number(bookingForm.guests),
      });
      setBookingMsg(res.message);
      setBookingForm({ customerName: "", email: "", phone: "", eventDate: "", guests: "", message: "" });
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Failed to submit");
    }
  }

  return (
    <div>
      {/* Cover */}
      <div className="relative h-48 sm:h-64 lg:h-80">
        <SafeImage
          src={caterer.coverImage || `https://picsum.photos/seed/${caterer.id}-cover/1200/400`}
          alt={caterer.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-5xl px-4 pb-6 sm:px-6 lg:px-8">
          <Link href="/caterers" className="interactive mb-3 inline-flex text-sm font-medium text-white/90 hover:text-white">
            ← Back to caterers
          </Link>
          <div className="flex items-end gap-4">
            {caterer.logo && (
              <div className="relative hidden h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 border-white shadow-lg sm:block">
                <SafeImage src={caterer.logo} alt="Logo" fill sizes="64px" className="object-cover" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-4xl">{caterer.name}</h1>
              <p className="mt-1 text-white/80">{caterer.location}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-stone-900">About</h2>
              <p className="mt-3 leading-relaxed text-stone-600">{caterer.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {caterer.cuisines.map((c) => (
                  <span key={c} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">{c}</span>
                ))}
              </div>
            </section>

            {/* Ads */}
            {caterer.advertisements?.length > 0 && (
              <section className="space-y-3">
                {caterer.advertisements.map((ad) => (
                  <div key={ad.id} className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">
                    {ad.image && (
                      <div className="relative h-32 w-full">
                        <SafeImage src={ad.image} alt={ad.title} fill sizes="100vw" className="object-cover" />
                      </div>
                    )}
                    <p className="p-4 font-semibold text-amber-900">{ad.title}</p>
                  </div>
                ))}
              </section>
            )}

            {/* Packages */}
            {caterer.packages?.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold text-stone-900">Pricing Packages</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {caterer.packages.map((pkg) => (
                    <div key={pkg.id || pkg.name} className={`rounded-2xl border p-5 ${pkg.isPopular ? "border-amber-400 bg-amber-50 ring-2 ring-amber-200" : "border-stone-200 bg-white"}`}>
                      {pkg.isPopular && <span className="mb-2 inline-block rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">Popular</span>}
                      <h3 className="font-bold text-stone-900">{pkg.name}</h3>
                      <p className="mt-1 text-2xl font-bold text-amber-700">₹{pkg.price.toLocaleString("en-IN")}<span className="text-sm font-normal text-stone-500">/plate</span></p>
                      <p className="mt-2 text-sm text-stone-600">{pkg.description}</p>
                      <ul className="mt-3 space-y-1">
                        {pkg.includes?.map((inc) => (
                          <li key={inc} className="flex items-center gap-2 text-sm text-stone-600">
                            <span className="text-emerald-500">✓</span> {inc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Services */}
            {caterer.services?.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold text-stone-900">Services Offered</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {caterer.services.map((s) => (
                    <div key={s.id || s.name} className="rounded-xl border border-stone-200 bg-white p-4">
                      <h3 className="font-semibold text-stone-900">{s.name}</h3>
                      <p className="mt-1 text-sm text-stone-500">{s.description}</p>
                      {s.price > 0 && <p className="mt-2 text-sm font-bold text-amber-700">₹{s.price.toLocaleString("en-IN")}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery */}
            {gallery.length > 0 && <ImageGallery images={gallery} title="Photo Gallery" />}

            {/* Menu */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-stone-900">Complete Menu</h2>
              <StructuredMenuList items={menu} />
            </section>

            {/* Testimonials */}
            {caterer.testimonials?.length > 0 && (
              <section>
                <h2 className="mb-4 text-xl font-bold text-stone-900">Customer Reviews</h2>
                <div className="space-y-4">
                  {caterer.testimonials.map((t) => (
                    <div key={t.id || t.customerName} className={`rounded-2xl border p-5 ${t.featured ? "border-amber-200 bg-amber-50" : "border-stone-200 bg-white"}`}>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-stone-900">{t.customerName}</p>
                        <div className="flex text-amber-400">{"★".repeat(t.rating)}</div>
                      </div>
                      {t.eventType && <p className="mt-0.5 text-xs text-stone-500">{t.eventType}</p>}
                      <p className="mt-2 text-sm leading-relaxed text-stone-600">&ldquo;{t.text}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
              <StarRating rating={caterer.rating} />
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-stone-400">Starting from</p>
              <p className="text-3xl font-bold text-stone-900">₹{caterer.pricePerPlate.toLocaleString("en-IN")}</p>
              <p className="text-xs text-stone-500">per plate</p>
              {caterer.profileViews != null && (
                <p className="mt-3 text-xs text-stone-400">{caterer.profileViews.toLocaleString()} profile views</p>
              )}
            </div>

            <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-stone-900">Contact</h3>
              <div className="mt-3 space-y-2 text-sm text-stone-600">
                {caterer.phone && <p>📞 {caterer.phone}</p>}
                {caterer.email && <p>✉️ {caterer.email}</p>}
                {caterer.website && (
                  <a href={caterer.website} target="_blank" rel="noopener noreferrer" className="interactive block text-amber-700 hover:text-amber-900">
                    🌐 Visit website
                  </a>
                )}
              </div>
              {caterer.socialMedia && (
                <div className="mt-3 flex gap-2">
                  {caterer.socialMedia.instagram && <span className="rounded-full bg-stone-100 px-2 py-1 text-xs">@{caterer.socialMedia.instagram}</span>}
                  {caterer.socialMedia.facebook && <span className="rounded-full bg-stone-100 px-2 py-1 text-xs">FB</span>}
                </div>
              )}
            </div>

            <form onSubmit={handleBooking} className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-stone-900">Request a Booking</h3>
              <div className="mt-4 space-y-3">
                {["customerName", "email", "phone", "eventDate", "guests"].map((field) => (
                  <input
                    key={field}
                    required={field !== "phone"}
                    type={field === "email" ? "email" : field === "eventDate" ? "date" : field === "guests" ? "number" : "text"}
                    placeholder={field === "customerName" ? "Your name" : field === "eventDate" ? "Event date" : field === "guests" ? "Guest count" : field}
                    value={bookingForm[field as keyof typeof bookingForm]}
                    onChange={(e) => setBookingForm({ ...bookingForm, [field]: e.target.value })}
                    className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-amber-400"
                  />
                ))}
                <textarea
                  placeholder="Message (optional)"
                  rows={2}
                  value={bookingForm.message}
                  onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-amber-400"
                />
              </div>
              {bookingError && <p className="mt-2 text-xs text-red-600">{bookingError}</p>}
              {bookingMsg && <p className="mt-2 text-xs text-emerald-600">{bookingMsg}</p>}
              <button type="submit" className="interactive mt-4 w-full rounded-xl bg-amber-600 py-2.5 text-sm font-semibold text-white hover:bg-amber-700">
                Send Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
