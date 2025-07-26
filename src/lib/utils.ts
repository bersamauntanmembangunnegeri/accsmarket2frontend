import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://accsmarket2backend-1.onrender.com';

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(3)}`;
};

export const formatStock = (stock: number): string => {
  if (stock === 0) return 'Out of Stock';
  if (stock < 10) return `${stock} left`;
  return `${stock} available`;
};

export const getStockColor = (stock: number): string => {
  if (stock === 0) return 'text-red-600';
  if (stock < 10) return 'text-orange-600';
  return 'text-green-600';
};

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined && value !== 'all') {
      searchParams.append(key, value.toString());
    }
  });
  
  return searchParams.toString();
};

export const parseUrlParams = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};
  
  urlParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
};

