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
  return `${process.env.NEXT_PUBLIC_CMS_BASE_URL}/assets/${id}`;
}