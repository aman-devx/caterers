import Link from "next/link";
import SafeImage from "./SafeImage";
import { LANDING_IMAGES } from "@/lib/images";

export default function AboutSection() {
  return (
    <section id="about" className="border-t border-stone-200/80 bg-white py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-700">About CaterersNearMe</p>
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            India&apos;s trusted platform for finding the perfect caterer
          </h2>
          <p className="mt-5 text-base leading-relaxed text-stone-600">
            CaterersNearMe connects event hosts with verified catering partners. Plan weddings,
            corporate events, and celebrations with confidence — compare menus, packages, galleries, and reviews.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/caterers" className="interactive rounded-full bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-amber-700">
              Start Searching
            </Link>
            <Link href="/categories/wedding-catering" className="interactive rounded-full border border-stone-300 px-6 py-2.5 text-sm font-semibold text-stone-700 hover:border-amber-300 hover:bg-amber-50">
              Wedding Caterers
            </Link>
          </div>
        </div>
        <div className="relative grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg">
              <SafeImage {...LANDING_IMAGES.about[0]} fill sizes="25vw" className="object-cover" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg">
              <SafeImage {...LANDING_IMAGES.about[1]} fill sizes="25vw" className="object-cover" />
            </div>
          </div>
          <div className="space-y-4 pt-8">
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg">
              <SafeImage {...LANDING_IMAGES.about[2]} fill sizes="25vw" className="object-cover" />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg">
              <SafeImage {...LANDING_IMAGES.about[3]} fill sizes="25vw" className="object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
