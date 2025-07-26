export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  children?: Category[];
}

export interface Product {
  id: number;
  category_id: number;
  title: string;
  description: string;
  price: number;
  stock_quantity: number;
  rating: number;
  total_reviews: number;
  account_type: string;
  category: {
    name: string;
  };
  vendor?: {
    vendor_name: string;
  };
}

export interface Platform {
  id: number;
  name: string;
}

export interface Filters {
  keyword?: string;
  category_id?: string;
  platform?: string;
  category?: string;
  vendor?: string;
  min_price?: string;
  max_price?: string;
  min_quantity?: string;
  max_quantity?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
  created_at?: string;
}

export interface Vendor {
  id: number;
  vendor_name: string;
  email?: string;
  rating?: number;
  total_sales?: number;
}

