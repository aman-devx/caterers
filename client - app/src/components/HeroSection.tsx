import Link from "next/link";
import SafeImage from "./SafeImage";
import { LANDING_IMAGES } from "@/lib/images";

export default function HeroSection() {
  const [main, ...rest] = LANDING_IMAGES.hero;

  return (
    <section className="relative overflow-hidden bg-stone-900">
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-40 md:grid-cols-4 md:grid-rows-1 md:opacity-50">
        {LANDING_IMAGES.hero.map((img) => (
          <div key={img.src} className="relative min-h-[120px] md:min-h-[520px]">
            <SafeImage src={img.src} alt={img.alt} fill sizes="25vw" className="object-cover" priority />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-900/85 to-stone-900/70" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300">
            Weddings · Corporate · Celebrations
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find the perfect caterer for every{" "}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              unforgettable event
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-300">
            From royal wedding banquets to corporate lunches and birthday feasts — browse curated
            caterers, full menus, pricing, and reviews across India.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/caterers" className="interactive inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-3.5 text-sm font-semibold text-stone-900 shadow-lg hover:bg-amber-400">
              Explore Caterers
            </Link>
            <a href="#about" className="interactive inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
              Learn More
            </a>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
            <SafeImage src={main.src} alt={main.alt} fill sizes="50vw" className="object-cover" priority />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {rest.slice(0, 3).map((img) => (
              <div key={img.src} className="relative aspect-video overflow-hidden rounded-xl ring-1 ring-white/10">
                <SafeImage src={img.src} alt={img.alt} fill sizes="15vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
