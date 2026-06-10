"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-lg shadow-md shadow-amber-200/50 transition-transform group-hover:scale-105">
            🍽️
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-stone-900">
              CaterersNearMe
            </span>
            <span className="text-[11px] font-medium text-stone-500">
              Find your perfect caterer
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            href="/caterers"
            className="interactive hidden rounded-full px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 sm:inline-flex"
          >
            Browse
          </Link>

          {!loading && (
            <>
              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="interactive rounded-full px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
                    >
                      Admin
                    </Link>
                  )}
                  {user.role === "caterer" && (
                    <Link
                      href="/caterer/dashboard"
                      className="interactive rounded-full px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={logout}
                    className="interactive rounded-full border border-stone-200 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="interactive rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
                >
                  Login
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
