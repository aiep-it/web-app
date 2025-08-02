import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getApiUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  // const version = process.env.API_VERSION;

  return baseUrl;
};

export function getCmsAssetUrl(id?: string | null): string {
  if (!id) return '';
  // Add cache busting parameter to prevent browser caching
  const timestamp = Date.now();
  return `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/assets/${id}?t=${timestamp}`;
}