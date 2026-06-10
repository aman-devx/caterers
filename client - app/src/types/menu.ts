export interface MenuItem {
  id: string;
  catererId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
  isVeg?: boolean;
  images?: string[];
  details?: string;
}
