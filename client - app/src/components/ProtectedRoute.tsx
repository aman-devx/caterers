"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/types/user";

const ROLE_HOME: Record<UserRole, string> = {
  admin: "/admin",
  caterer: "/caterer/dashboard",
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: UserRole;
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    } else if (!loading && user && user.role !== role) {
      router.replace(ROLE_HOME[user.role]);
    }
  }, [user, loading, role, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
      </div>
    );
  }

  if (!user || user.role !== role) return null;

  return <>{children}</>;
}
