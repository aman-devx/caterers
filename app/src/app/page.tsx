import Link from "next/link";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

const features = [
  {
    icon: "🔍",
    title: "Smart Search",
    description: "Find caterers instantly by name across our curated network.",
  },
  {
    icon: "💰",
    title: "Price Filtering",
    description: "Set your budget with min and max price per plate filters.",
  },
  {
    icon: "⭐",
    title: "Rated & Trusted",
    description: "Compare ratings, cuisines, and locations at a glance.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main>
        <HeroSection />

        <AboutSection />

        <section id="features" className="border-t border-stone-200/80 bg-stone-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                Everything you need to choose wisely
              </h2>
              <p className="mt-3 text-stone-600">
                A clean, fast experience built for event planners and hosts.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-stone-200/80 bg-stone-50 p-6 text-center transition-all hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50"
                >
                  <span className="text-3xl">{feature.icon}</span>
                  <h3 className="mt-4 text-lg font-semibold text-stone-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-amber-600 to-orange-600 py-16">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to find your caterer?
            </h2>
            <p className="mt-3 text-amber-100">
              Browse our full list of caterers with search and price filters.
            </p>
            <Link
              href="/caterers"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-amber-800 shadow-lg transition-all hover:bg-amber-50"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200/80 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-stone-500 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} CaterersNearMe
        </div>
      </footer>
    </div>
  );
}
