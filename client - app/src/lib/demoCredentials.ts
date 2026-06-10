import type { DemoCredential } from "@/types/user";

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    role: "Admin",
    email: "admin@caterersnearme.com",
    password: "admin123",
    description: "Manage caterers & create login credentials",
    color: "from-stone-800 to-stone-900",
  },
  {
    role: "Caterer",
    email: "caterer@caterersnearme.com",
    password: "caterer123",
    description: "Manage menu, gallery, bookings & analytics",
    color: "from-amber-500 to-orange-600",
  },
];
