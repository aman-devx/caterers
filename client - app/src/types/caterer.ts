import type { MenuItem } from "./menu";

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface Caterer {
  id: string;
  name: string;
  location: string;
  pricePerPlate: number;
  cuisines: string[];
  rating: number;
  description?: string;
  userId?: string | null;
  categoryIds?: string[];
  coverImage?: string;
  logo?: string;
  gallery?: string[];
  images?: string[];
  phone?: string;
  email?: string;
  website?: string;
  socialMedia?: SocialMedia;
  profileViews?: number;
  loginEmail?: string | null;
  hasLogin?: boolean;
}

export interface PricingPackage {
  id?: string;
  name: string;
  description: string;
  price: number;
  includes: string[];
  isPopular?: boolean;
}

export interface CatererService {
  id?: string;
  name: string;
  description: string;
  price: number;
  isActive?: boolean;
}

export interface Testimonial {
  id?: string;
  customerName: string;
  text: string;
  rating: number;
  eventType?: string;
  featured?: boolean;
}

export interface Advertisement {
  id?: string;
  title: string;
  image: string;
  link?: string;
  isActive?: boolean;
  views?: number;
  clicks?: number;
}

export interface Booking {
  id?: string;
  customerName: string;
  email: string;
  phone?: string;
  eventDate: string;
  guests: number;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "completed";
}

export interface CatererFullProfile extends Caterer {
  menuItems: MenuItem[];
  menuCategories: { id?: string; name: string; sortOrder: number }[];
  packages: PricingPackage[];
  services: CatererService[];
  testimonials: Testimonial[];
  reviews: Testimonial[];
  advertisements: Advertisement[];
}

export interface DashboardAnalytics {
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

export interface CatererDashboardData {
  profile: Caterer;
  menu: MenuItem[];
  menuCategories: { id: string; name: string; sortOrder: number }[];
  packages: PricingPackage[];
  services: CatererService[];
  testimonials: Testimonial[];
  advertisements: Advertisement[];
  bookings: Booking[];
  analytics: DashboardAnalytics;
}
